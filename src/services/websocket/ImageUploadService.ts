import axios from "axios";
import imageCompression from "browser-image-compression";

export interface UploadImageParams {
  image: File;
  connectionId: string;
  clinicaId: string;
  caption?: string;
}

export interface UploadImageResponse {
  status: string;
  message: string;
}

export class ImageUploadService {
  private baseUrl: string;
  private token: string;

  constructor(baseUrl: string, token: string) {
    this.baseUrl = baseUrl;
    this.token = token;
  }

  /**
   * Comprime uma imagem antes do upload
   * @param file Arquivo de imagem original
   * @returns Arquivo comprimido
   */
  async compressImage(file: File): Promise<File> {
    const options = {
      maxSizeMB: 1, // Máximo 1MB
      maxWidthOrHeight: 1920, // Máximo 1920px
      useWebWorker: true,
      fileType: file.type as any,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.error("Erro ao comprimir imagem:", error);
      // Se falhar, retorna o arquivo original
      return file;
    }
  }

  /**
   * Valida o tipo de arquivo de imagem
   * @param file Arquivo a ser validado
   * @returns true se válido, false caso contrário
   */
  validateImageType(file: File): boolean {
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/bmp",
    ];

    return allowedTypes.includes(file.type);
  }

  /**
   * Valida o tamanho do arquivo
   * @param file Arquivo a ser validado
   * @param maxSizeMB Tamanho máximo em MB (padrão: 10MB)
   * @returns true se válido, false caso contrário
   */
  validateImageSize(file: File, maxSizeMB: number = 10): boolean {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  }

  /**
   * Faz upload de uma imagem para o servidor
   * @param params Parâmetros do upload
   * @param onProgress Callback de progresso (0-100)
   * @returns Resposta do servidor
   */
  async uploadImage(
    params: UploadImageParams,
    onProgress?: (progress: number) => void
  ): Promise<UploadImageResponse> {
    // Validações
    if (!this.validateImageType(params.image)) {
      throw new Error(
        "Tipo de arquivo não suportado. Use: JPG, PNG, GIF, WEBP ou BMP"
      );
    }

    if (!this.validateImageSize(params.image)) {
      throw new Error("Arquivo muito grande. Tamanho máximo: 10MB");
    }

    // Comprimir imagem
    const compressedImage = await this.compressImage(params.image);

    // Normalizar nome do arquivo (remover espaços e caracteres especiais)
    const normalizedFileName = compressedImage.name
      .replace(/\s+/g, "_") // Substituir espaços por underscore
      .replace(/[^\w.-]/g, "") // Remover caracteres especiais
      .toLowerCase(); // Converter para minúsculas

    // Criar novo File com nome normalizado
    const normalizedFile = new File([compressedImage], normalizedFileName, {
      type: compressedImage.type,
    });

    // Criar FormData
    const formData = new FormData();
    formData.append("image", normalizedFile);
    formData.append("connection_id", params.connectionId);
    formData.append("clinica_id", params.clinicaId);
    if (params.caption) {
      formData.append("caption", params.caption);
    }

    try {
      const response = await axios.post(
        `${this.baseUrl}/api/v1/websocket/upload-image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${this.token}`,
          },
          onUploadProgress: (progressEvent) => {
            if (onProgress && progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              onProgress(percentCompleted);
            }
          },
        }
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Erro ao fazer upload da imagem"
      );
    }
  }

  /**
   * Constrói a URL completa de um anexo (com token para autenticação)
   * @param attachmentId ID do anexo
   * @returns URL completa
   */
  getAttachmentUrl(attachmentId: string): string {
    // Usar o token como query param para funcionar em tags <img>
    return `${this.baseUrl}/api/v1/websocket/attachments/${attachmentId}`;
  }

  /**
   * Constrói a URL completa de um anexo a partir de uma URL relativa
   * @param fileUrl URL relativa (ex: /api/v1/websocket/attachments/uuid)
   * @returns URL completa
   */
  getFullAttachmentUrl(fileUrl: string): string {
    if (!fileUrl) return "";

    // Se já for uma URL completa, retorna como está
    if (fileUrl.startsWith("http://") || fileUrl.startsWith("https://")) {
      return fileUrl;
    }

    // Se for uma URL relativa, adiciona o baseUrl
    const cleanUrl = fileUrl.startsWith("/") ? fileUrl : `/${fileUrl}`;
    return `${this.baseUrl}${cleanUrl}`;
  }

  /**
   * Cria uma URL de preview local para a imagem antes do upload
   * @param file Arquivo de imagem
   * @returns URL de preview (blob URL)
   */
  createPreviewUrl(file: File): string {
    return URL.createObjectURL(file);
  }

  /**
   * Revoga uma URL de preview criada anteriormente
   * @param url URL a ser revogada
   */
  revokePreviewUrl(url: string): void {
    URL.revokeObjectURL(url);
  }
}
