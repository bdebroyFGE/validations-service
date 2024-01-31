import { RekognitionClient, CompareFacesCommand, CompareFacesRequest, DetectTextCommand, DetectTextCommandInput } from "@aws-sdk/client-rekognition";
import { findInvoiceRelevantData } from "../utils/functions";

export const compareFaces = async (source: string, target: string, bucket: string = "funtecdevtesting") => {
    try {
        const client = new RekognitionClient({ region: 'us-east-1' });
        const request: CompareFacesRequest = {
            SourceImage: {
                S3Object: {
                    Bucket: bucket,
                    Name: source
                }
            },
            TargetImage: {
                S3Object: {
                    Bucket: bucket,
                    Name: target
                }
            },
            SimilarityThreshold: 90
        }
        const command = new CompareFacesCommand(request);
        const result = await client.send(command);
        if (!result.FaceMatches || result.FaceMatches.length !== 1) {
            return {
                success: false,
                message: "No se encontró coincidencia",
                data: null
            }
        }
        const match = result.FaceMatches[0]
        return {
            success: true,
            message: "Coincidencia encontrada",
            data: match.Similarity
        }

    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: "Ocurrió un error al comparar las imágenes",
            data: null
        }
    }
}

export const getTextFromImage = async (image: string, bucket: string = "funtecdevtesting") => {
    try {
        const client = new RekognitionClient({ region: 'us-east-1' });
        const request: DetectTextCommandInput = {
            Image: {
                S3Object: {
                    Bucket: bucket,
                    Name: image
                }
            }
        }
        const command = new DetectTextCommand(request);
        const result = await client.send(command);
        if (!result.TextDetections || result.TextDetections.length === 0) {
            return {
                success: false,
                message: "No se encontró texto en la imagen",
                data: null
            }
        }
        const text = result.TextDetections.map(t => t.DetectedText || "")
        const found = findInvoiceRelevantData(text);
        if (!found.success) {
            return {
                success: false,
                message: found.message,
                data: null
            }
        }
        return {
            success: true,
            message: "Texto obtenido correctamente",
            data: found.data
        }

    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: "Ocurrió un error al obtener el texto",
            data: null
        }
    }
}