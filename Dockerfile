# Etapa 1: Build com Maven e Java 17
FROM maven:3.9.6-eclipse-temurin-17 AS build

WORKDIR /app

# Copia somente a subpasta Backend
COPY Backend/ ./Backend/

WORKDIR /app/Backend

RUN chmod +x mvnw && ./mvnw clean package -DskipTests

# Etapa 2: Criar a imagem final
FROM eclipse-temurin:17-jdk

WORKDIR /app

COPY --from=build /app/Backend/target/dsdeliver-0.0.1-SNAPSHOT.jar app.jar

CMD ["java", "-jar", "app.jar"]
