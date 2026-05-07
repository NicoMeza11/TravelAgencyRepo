FROM eclipse-temurin:21
ARG JAR_FILE=target/mi-backend.jar
COPY ${JAR_FILE} mi-backend.jar
ENTRYPOINT ["java", "-jar", "/mi-backend.jar"]