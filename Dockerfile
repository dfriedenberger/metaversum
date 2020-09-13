FROM openjdk:8
          
ARG JAR_FILE 
COPY $JAR_FILE app.jar

EXPOSE 80
ENTRYPOINT [ "sh", "-c", "java $JAVA_OPTS -jar /app.jar"]


