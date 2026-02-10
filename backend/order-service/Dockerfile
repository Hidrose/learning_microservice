FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

RUN apt-get update \
 && apt-get install -y ca-certificates \
 && update-ca-certificates

COPY pom.xml .
RUN mvn dependency:go-offline -B

COPY src ./src
RUN mvn package -DskipTests

FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

COPY --from=build /app/target/order-service-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8083
ENTRYPOINT ["java","-jar","app.jar"]