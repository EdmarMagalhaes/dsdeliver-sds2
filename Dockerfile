# Usa uma imagem oficial do Java 17 com Maven já instalado
FROM maven:3.9.6-eclipse-temurin-17 AS build

# Define diretório de trabalho dentro do container
WORKDIR /app

# Copia todos os arquivos do repositório para o container
COPY . .

# Faz o build do projeto (gera o .jar)
RUN chmod +x mvnw && ./mvnw clean package -DskipTests

# -------------------------------
# Agora criamos a imagem final
FROM eclipse-temurin:17-jdk

WORKDIR /app

# Copia o .jar gerado na etapa de build
COPY --from=build /app/target/dsdeliver-0.0.1-SNAPSHOT.jar app.jar

# Comando para rodar a aplicação
CMD ["java", "-jar", "app.jar"]
