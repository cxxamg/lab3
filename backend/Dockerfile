FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests

FROM quay.io/wildfly/wildfly:34.0.1.Final-jdk17
COPY --from=build /app/src/properties.env /app/src/properties.env
COPY --from=build /app/target/backend.war /opt/jboss/wildfly/standalone/deployments/backend.war
EXPOSE 8080

CMD ["/opt/jboss/wildfly/bin/standalone.sh", "-b", "0.0.0.0"]
