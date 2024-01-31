import config from "../config";
import { parseRenap, uploadToS3 } from "../utils/functions";

export const getRenap = async (dpi: string) => {
    const body = {
        cui: dpi,
    }
    try {
        const response = await fetch(config.renap.url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                SecretKey: config.renap.secretKey,
                AppBundle: config.renap.appBundle
            },
            body: JSON.stringify(body),
        });
        const data = await response.json();
        if (!data) {
            return {
                success: false,
                message: "No se encontró información con el DPI ingresado",
                data: null,
                status: response.status
            }
        }
        const parsed = parseRenap(data);
        if (!parsed.success || !parsed.data?.picture) {
            return {
                success: false,
                message: parsed.message,
                data: null,
                status: response.status
            }
        }
        // upload to s3
        const uploadResult = await uploadToS3("funtecdevtesting", parsed.data.picture, `renap/${dpi}.jpg`);
        if (!uploadResult.success || !uploadResult.data) {
            return {
                success: false,
                message: uploadResult.message,
                data: null,
                status: response.status
            }
        }
        parsed.data.picture = uploadResult.data;
        return {
            success: true,
            message: "Información obtenida correctamente",
            data: parsed.data,
            status: response.status
        }

    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: "Ocurrió un error al obtener la información",
            data: null,
            status: 500
        }
    }

}