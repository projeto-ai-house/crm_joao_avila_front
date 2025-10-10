import archiver from "archiver";
import { config } from "dotenv";
import { createWriteStream, existsSync } from "fs";
import { NodeSSH } from "node-ssh";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

// Para ESM - obtém o diretório atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Carrega variáveis de ambiente do arquivo .env.deploy na pasta deploy
config({ path: resolve(__dirname, ".env.deploy") });

const ssh = new NodeSSH();

// Configurações da VPS
const deployConfig = {
  host: process.env.VPS_HOST,
  port: parseInt(process.env.VPS_PORT || "22"),
  username: process.env.VPS_USERNAME,
  password: process.env.VPS_PASSWORD,
  privateKeyPath: process.env.VPS_PRIVATE_KEY_PATH,
  remoteDir: process.env.VPS_REMOTE_DIR,
  remoteModuleName: process.env.VPS_REMOTE_MODULE_NAME || "frontend",
  dockerComposeFile: process.env.DOCKER_COMPOSE_FILE || "docker-compose.yml",
  projectName: process.env.PROJECT_NAME || "crm-joao-avila",
};
console.log("🚀 Configurações de deploy:", deployConfig);

// Valida configurações obrigatórias
function validateConfig() {
  const required = ["host", "username", "remoteDir"];
  const missing = required.filter((key) => !deployConfig[key]);

  if (missing.length > 0) {
    console.error(
      "❌ Configurações obrigatórias faltando:",
      missing.join(", ")
    );
    console.error("Por favor, configure o arquivo .env.deploy");
    process.exit(1);
  }

  if (!deployConfig.password && !deployConfig.privateKeyPath) {
    console.error(
      "❌ É necessário fornecer VPS_PASSWORD ou VPS_PRIVATE_KEY_PATH"
    );
    process.exit(1);
  }
}

// Conecta ao servidor via SSH
async function connect() {
  console.log("🔌 Conectando ao servidor...");

  const connectionConfig = {
    host: deployConfig.host,
    port: deployConfig.port,
    username: deployConfig.username,
  };

  // Usa chave privada se fornecida, caso contrário usa senha
  if (deployConfig.privateKeyPath) {
    if (!existsSync(deployConfig.privateKeyPath)) {
      throw new Error(
        `Chave privada não encontrada: ${deployConfig.privateKeyPath}`
      );
    }
    connectionConfig.privateKeyPath = deployConfig.privateKeyPath;
  } else {
    connectionConfig.password = deployConfig.password;
  }

  await ssh.connect(connectionConfig);
  console.log("✅ Conectado com sucesso!");
}

// Cria o diretório remoto se não existir
async function ensureRemoteDirectory() {
  console.log("📁 Verificando diretório remoto...");
  await ssh.execCommand(
    `mkdir -p ${deployConfig.remoteDir + "/" + deployConfig.remoteModuleName}`
  );
  console.log(
    `✅ Diretório ${
      deployConfig.remoteDir + "/" + deployConfig.remoteModuleName
    } pronto`
  );
}

// Compacta o projeto (excluindo node_modules, dist, etc)
async function compressProject() {
  return new Promise((res, rej) => {
    console.log("📦 Compactando projeto...");

    // Diretório raiz do projeto (uma pasta acima da pasta deploy)
    const projectRoot = resolve(__dirname, "..");
    const outputPath = resolve(projectRoot, "deploy-package.tar.gz");

    const output = createWriteStream(outputPath);
    const archive = archiver("tar", {
      gzip: true,
      gzipOptions: { level: 9 },
    });

    console.log("📍 outputPath:", outputPath);

    // Handle write stream errors
    output.on("error", (err) => {
      console.error("❌ Erro no output stream:", err.message);
      rej(err);
    });

    // When the file is fully written
    output.on("close", () => {
      try {
        const sizeMB = (archive.pointer() / 1024 / 1024).toFixed(2);
        console.log(`✅ Projeto compactado: ${sizeMB} MB`);
      } catch (e) {
        console.log("✅ Projeto compactado");
      }
      res();
    });

    // Archiver warnings (e.g., stat failures) — treat as warnings unless fatal
    archive.on("warning", (err) => {
      if (err && err.code === "ENOENT") {
        console.warn("⚠️  Arquivo ignorado durante compactação:", err.message);
      } else {
        console.warn(
          "⚠️  Aviso do archiver:",
          err && err.message ? err.message : err
        );
      }
    });

    // Archiver errors (fatal)
    archive.on("error", (err) => {
      console.error("❌ Erro do archiver:", err.message || err);
      rej(err);
    });

    archive.pipe(output);

    // Adiciona arquivos ao arquivo, excluindo pastas desnecessárias
    archive.glob("**/*", {
      cwd: projectRoot,
      ignore: [
        "node_modules/**",
        "dist/**",
        ".git/**",
        ".vscode/**",
        "deploy-package.tar.gz",
        "deploy/.env.deploy",
        ".env",
        ".env.*",
        "*.log",
        "coverage/**",
        ".DS_Store",
        "crm_uploads/**",
      ],
    });

    // Safety: timeout if archive doesn't finish within reasonable time
    const finishTimeout = setTimeout(() => {
      const err = new Error("Tempo esgotado ao compactar o projeto");
      console.error("❌", err.message);
      rej(err);
    }, 2 * 60 * 1000); // 2 minutes

    // Clear timeout when closed or on error
    const clearFinishTimeout = () => clearTimeout(finishTimeout);
    output.on("close", clearFinishTimeout);
    archive.on("error", clearFinishTimeout);

    archive.finalize();
  });
}

// Transfere o arquivo compactado para o servidor
async function uploadProject() {
  console.log("📤 Enviando projeto para o servidor...");

  const projectRoot = resolve(__dirname, "..");
  const localFile = resolve(projectRoot, "deploy-package.tar.gz");
  const remoteFile = `${
    deployConfig.remoteDir + "/" + deployConfig.remoteModuleName
  }/deploy-package.tar.gz`;

  if (!existsSync(localFile)) {
    throw new Error(
      "Arquivo de deploy não encontrado. Execute a compactação primeiro."
    );
  }

  await ssh.putFile(localFile, remoteFile, null, {
    concurrency: 1,
    chunkSize: 64 * 1024,
  });

  console.log("✅ Projeto enviado com sucesso!");
}

// Extrai o projeto no servidor
async function extractProject() {
  console.log("📂 Extraindo projeto no servidor...");

  const commands = [
    `cd ${deployConfig.remoteDir + "/" + deployConfig.remoteModuleName}`,
    "tar -xzf deploy-package.tar.gz",
    "rm deploy-package.tar.gz",
  ].join(" && ");

  const result = await ssh.execCommand(commands);

  if (result.code !== 0) {
    console.error("❌ Erro ao extrair:", result.stderr);
    throw new Error("Falha ao extrair projeto");
  }

  console.log("✅ Projeto extraído com sucesso!");
}

// Para e remove containers antigos
async function stopContainers() {
  console.log("🛑 Parando containers antigos...");

  await ssh.execCommand("cd ..");
  const command = `cd ${deployConfig.remoteDir} && docker compose -f ${deployConfig.dockerComposeFile} down`;
  const result = await ssh.execCommand(command);

  if (result.code !== 0) {
    console.warn("⚠️  Aviso ao parar containers:", result.stderr);
  } else {
    console.log("✅ Containers parados");
  }
}

// Faz o pull das imagens Docker
async function dockerPull() {
  console.log("🐳 Fazendo pull das imagens Docker...");

  await ssh.execCommand("cd ..");
  const command = `cd ${deployConfig.remoteDir} && docker compose -f ${deployConfig.dockerComposeFile} pull`;
  const result = await ssh.execCommand(command);

  if (result.code !== 0) {
    console.warn("⚠️  Aviso ao fazer pull:", result.stderr);
  }

  console.log("✅ Pull das imagens concluído");
  if (result.stdout) console.log(result.stdout);
}

// Reconstrói e inicia os containers
async function startContainers() {
  console.log("🚀 Iniciando containers...");

  await ssh.execCommand("cd ..");
  const command = `cd ${deployConfig.remoteDir} && docker compose -f ${deployConfig.dockerComposeFile} up -d --build`;
  const result = await ssh.execCommand(command);

  if (result.code !== 0) {
    console.error("❌ Erro ao iniciar containers:", result.stderr);
    throw new Error("Falha ao iniciar containers");
  }

  console.log("✅ Containers iniciados com sucesso!");
  if (result.stdout) console.log(result.stdout);
}

// Verifica o status dos containers
async function checkStatus() {
  console.log("📊 Verificando status dos containers...");

  const command = `cd ${deployConfig.remoteDir} && docker-compose -f ${deployConfig.dockerComposeFile} ps`;
  const result = await ssh.execCommand(command);

  console.log("\n" + result.stdout);
}

// Limpa arquivos temporários locais
async function cleanup() {
  console.log("🧹 Limpando arquivos temporários...");

  const { unlink } = await import("fs/promises");
  const projectRoot = resolve(__dirname, "..");
  const localFile = resolve(projectRoot, "deploy-package.tar.gz");

  try {
    if (existsSync(localFile)) {
      await unlink(localFile);
      console.log("✅ Arquivos temporários removidos");
    }
  } catch (error) {
    console.warn(
      "⚠️  Não foi possível remover arquivo temporário:",
      error.message
    );
  }
}

// Função principal de deploy
async function deploy() {
  const startTime = Date.now();

  try {
    console.log("🚀 ========================================");
    console.log("🚀   INICIANDO DEPLOY - " + deployConfig.projectName);
    console.log("🚀 ========================================\n");

    validateConfig();

    // 1. Compacta o projeto
    await compressProject();

    // 2. Conecta ao servidor
    await connect();

    // 3. Garante que o diretório existe
    await ensureRemoteDirectory();

    // 4. Envia o projeto
    await uploadProject();

    // 5. Extrai o projeto
    await extractProject();

    // 6. Para containers antigos
    await stopContainers();

    // 7. Faz pull das imagens (se usar imagens externas)
    await dockerPull();

    // 8. Reconstrói e inicia containers
    await startContainers();

    // 9. Verifica status
    await checkStatus();

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log("\n✅ ========================================");
    console.log(`✅   DEPLOY CONCLUÍDO EM ${duration}s`);
    console.log("✅ ========================================\n");
  } catch (error) {
    console.error("\n❌ ========================================");
    console.error("❌   ERRO NO DEPLOY");
    console.error("❌ ========================================");
    console.error("❌", error.message);
    console.error("\n", error);
    process.exit(1);
  } finally {
    // Fecha conexão SSH
    ssh.dispose();

    // Limpa arquivos temporários
    await cleanup();
  }
}

// Executa o deploy
deploy();
