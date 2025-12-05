package DAO;

import java.io.FileInputStream;
import java.util.Properties;
import java.util.logging.Logger;

public class ReaderEnv{
    private static final String PATH="/app/src/properties.env";
    private static final Logger logger = Logger.getLogger(ReaderEnv.class.getName());

    public static String[] readerEnv() {
        String[] props = new String[5];
        Properties properties = new Properties();
        try (FileInputStream input = new FileInputStream(PATH)){
            properties.load(input);
            String HOST = properties.getProperty("HOST");
            String TOKEN = properties.getProperty("TOKEN");
            String ORG = properties.getProperty("ORG");
            String BUCKET_USER = properties.getProperty("BUCKET_USER");
            String BUCKET_RESULT = properties.getProperty("BUCKET_RESULT");
            props[0] = HOST;
            props[1] = TOKEN;
            props[2] = ORG;
            props[3] = BUCKET_USER;
            props[4] = BUCKET_RESULT;
            return props;
        } catch (Exception e){
            logger.info(e.toString());
        }
        return null;
    } 
}