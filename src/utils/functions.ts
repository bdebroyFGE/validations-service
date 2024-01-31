import { S3Client, PutObjectCommand, GetObjectAttributesCommand, ObjectAttributes } from "@aws-sdk/client-s3";

export const findInvoiceRelevantData = (text: string[]) => {
    // start with a capital letter and end with 5 numbers, exactly 6 characters
    const regex = /^[A-Z]\d{5}$/;
    const found = text.filter(t => t.match(regex));
    if (found.length === 0) {
        return {
            success: false,
            message: "No se encontró información relevante",
            data: null
        }
    }
    return {
        success: true,
        message: "Información encontrada",
        data: [... new Set(found)]
    }
}

export const parseRenap = (response: any) => {
    try {
        if (response.data.length === 0) {
            return {
                success: false,
                message: "No se encontró información con el DPI ingresado",
                data: null,
                status: 404
            }
        }
        const user = response.data[0];
        const renapData: Record<string, string> = {
            cui: user.CUI,
            fname: user.PRIMER_NOMBRE,
            sname: user.SEGUNDO_NOMBRE,
            lname: user.PRIMER_APELLIDO,
            slname: user.SEGUNDO_APELLIDO,
            birthdate: user.FECHA_NACIMIENTO,
            gender: user.GENERO,
            civilStatus: user.ESTADO_CIVIL,
            nationality: user.NACIONALIDAD,
            country: user.PAIS_NACIMIENTO,
            department: user.DEPTO_NACIMIENTO,
            municipality: user.MUNI_NACIMIENTO,
            vecinity: user.VECINDAD,
            orderCedula: user.ORDEN_CEDULA,
            regCedula: user.REGISTRO_CEDULA,
            dpiExpiracy: user.FECHA_VENCIMIENTO,
            ocupation: user.OCUPACION,
            picture: user.FOTO,
        }
        return {
            success: true,
            message: "Información obtenida correctamente",
            data: renapData,
            status: 200
        }
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: "Ocurrió un error al obtener la información",
            data: null,
            status: 500
        }
    }
}

export const uploadToS3 = async (bucket: string, data: string, fileName: string) => {
    try {
        const client = new S3Client({ region: 'us-east-1' });
        // First check if the file exists
        const searchParams = {
            Bucket: bucket,
            Key: fileName,
            ObjectAttributes: ["ObjectSize"] as ObjectAttributes[]
        };
        const searchCommand = new GetObjectAttributesCommand(searchParams);
        const searchResult = await client.send(searchCommand);
        if (searchResult.ObjectSize) {
            return {
                success: true,
                message: "Imagen subida correctamente",
                data: `https://${bucket}.s3.amazonaws.com/${fileName}`,
                status: 200
            }
        }
        //
        const buffer = Buffer.from(data.replace(/^data:image\/\w+;base64,/, ""), 'base64');
        const uploadParams = {
            Bucket: bucket,
            Key: fileName,
            Body: buffer,
            ContentType: 'image/jpeg',
            ContentEcoding: 'base64',
            ACL: "public-read"
        } as const;
        const command = new PutObjectCommand(uploadParams);
        const result = await client.send(command);
        if (!result) {
            return {
                success: false,
                message: "Ocurrió un error al subir la imagen",
                data: null,
                status: 500
            }
        }
        return {
            success: true,
            message: "Imagen subida correctamente",
            data: `https://${bucket}.s3.amazonaws.com/${fileName}`,
            status: 201
        }
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: "Ocurrió un error al subir la imagen",
            data: null,
            status: 500
        }
    }
}