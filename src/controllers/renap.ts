import { renapAppBundle, renapSecretKey, renapURL } from "../config";
import { parseRenap, uploadToS3 } from "../utils/functions";

export const getRenap = async (dpi: string) => {
    const body = {
        cui: dpi,
    }
    try {
        const response = await fetch(renapURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                SecretKey: renapSecretKey,
                AppBundle: renapAppBundle
            },
            body: JSON.stringify(body),
        });
        const data = await response.json();
        if (!data) {
            return {
                success: false,
                message: "No se encontró información con el DPI ingresado",
                data: null
            }
        }
        const parsed = parseRenap(data);
        if (!parsed.success || !parsed.data?.picture) {
            return {
                success: false,
                message: parsed.message,
                data: null
            }
        }
        // upload to s3
        const uploadResult = await uploadToS3("funtecdevtesting", parsed.data.picture, `renap/${dpi}.jpg`);
        if (!uploadResult.success || !uploadResult.data) {
            return {
                success: false,
                message: uploadResult.message,
                data: null
            }
        }
        parsed.data.picture = uploadResult.data;
        return {
            success: true,
            message: "Información obtenida correctamente",
            data: parsed.data
        }

    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: "Ocurrió un error al obtener la información",
            data: null
        }
    }

}