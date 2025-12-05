package DAO;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.logging.Logger;

import com.influxdb.client.DeleteApi;
import com.influxdb.client.InfluxDBClient;
import com.influxdb.client.InfluxDBClientFactory;
import com.influxdb.client.QueryApi;
import com.influxdb.client.WriteApiBlocking;
import com.influxdb.client.write.Point;
import com.influxdb.query.FluxRecord;
import com.influxdb.query.FluxTable;

import DTO.User;
import DTO.UserPass;
import tools.hash.Hasher;

public class UserDAO{
    private static final Logger logger = Logger.getLogger(ResultDAO.class.getName());
    private static InfluxDBClient client;
    private static  String BUCKET = null;
    private static  String HOST = null;
    private static  char[] TOKEN = null;
    private static  String ORG = null;
    
    private static void getProperties(){
        String[] props = ReaderEnv.readerEnv();
        BUCKET = props[3];
        HOST = props[0];
        TOKEN = props[1].toCharArray();
        ORG = props[2];
    }


    public static void instantiateAddUser(User user){
        getProperties();
        logger.info(BUCKET + HOST + TOKEN.toString() + ORG);
        if (client == null){
            try {
                client = InfluxDBClientFactory.create(HOST,TOKEN,ORG,BUCKET);
            } catch (Exception e) {
                logger.info(e.toString());
            }
        }
        try {
            addUser(client, user);
            
        } catch (Exception e) {
            logger.info(e.toString());
        }

    }

    public static UserPass comparePasswords(User user){
        getProperties();
        logger.info(BUCKET + HOST + TOKEN.toString() + ORG);
        logger.info("comparing passwords: begin");
        if (client == null){
            try {
                client = InfluxDBClientFactory.create(HOST,TOKEN,ORG,BUCKET);
            } catch (Exception e) {
                logger.info(e.toString());
            }
        }
        try {
            String hashed = queryPassword(client, user);
            logger.info("hashed: " + hashed);
            if (hashed != null){
                if (!Hasher.isMatch(user.password(), hashed)){
                    return new UserPass(false,"Неправильный пароль" );
                }
            } else {
                return new UserPass(false, "Такого пользователя не сущетсвует");
            }
            
        } catch (Exception e) {
            logger.info(e.toString());
        }
        return new UserPass(true, "пароль правильный");
    }

    public static boolean isUserExists(User user){
        getProperties();
        logger.info(BUCKET + HOST + TOKEN.toString() + ORG);
        Boolean rtn = null;
        if (client == null){
            try {
                client = InfluxDBClientFactory.create(HOST,TOKEN,ORG,BUCKET);
            } catch (Exception e) {
                logger.info(e.toString());
            }
        }
        try {
            String qUser = queryUser(client, user);
            rtn = (qUser != null);
        } catch (Exception e) {
            logger.info(e.toString());
        }
        return rtn;
    }



    private static void addUser(InfluxDBClient client, User user){
        String password = user.password();
        String hashed = Hasher.hashPassword(password);
        Point point = Point.measurement("result")
        .addTag("user", user.login())
        .addField("password", hashed);
        try {
            WriteApiBlocking writeApi = client.getWriteApiBlocking();
            writeApi.writePoint(BUCKET, ORG, point);
            logger.info("Данные отправились в базу "+ ORG + BUCKET);
            logger.info("Пользователь добавлен" + user.login());
        } catch (Exception e) {
            logger.info("Данные не отправились: "+ e.toString());
        }
    }

    private static String queryPassword(InfluxDBClient client, User user){
        logger.info("comparing passwords: queryPassword");
        String fluxRequest = String.format("""
                                           from(bucket: \"%s\") |> range(start: 0)
                                           |> filter(fn: (r) => r[\"_measurement\"] == \"result\")
                                           |> filter(fn: (r) => r[\"_field\"] == \"password\")
                                           |> filter(fn: (r) => r[\"user\"] == \"%s\")""" //
        //
        //
        ,
                BUCKET,user.login());
        try {
            QueryApi queryApi = client.getQueryApi();
            List<FluxTable> tables = queryApi.query(fluxRequest);

            for (FluxTable table : tables) {
                for (FluxRecord record : table.getRecords()) {
                    return (String) record.getValueByKey("_value");
                }
            }
        } catch (Exception e) {
            logger.info("Данные не взялись из таблицы: " + e.toString());
        }
        return null;
    }

    private static String queryUser(InfluxDBClient client, User user){
        logger.info("comparing passwords: queryUser");
        String fluxRequest = String.format("""
                                           from(bucket: \"%s\") |> range(start: 0)
                                           |> filter(fn: (r) => r[\"_measurement\"] == \"result\")
                                           |> filter(fn: (r) => r[\"user\"] == \"%s\")""" //
        //
        //
        ,
                BUCKET,user.login());
        try {
            QueryApi queryApi = client.getQueryApi();
            List<FluxTable> tables = queryApi.query(fluxRequest);

            for (FluxTable table : tables) {
                for (FluxRecord record : table.getRecords()) {
                    return (String) record.getValueByKey("user");
                }
            }
        } catch (Exception e) {
            logger.info("Данные не взялись из таблицы: " + e.toString());
        }
        return null;
    }

    public static void deleteUserData(String user) {
        getProperties();
        logger.info(BUCKET + HOST + TOKEN.toString() + ORG);
    if (client == null) {
        client = InfluxDBClientFactory.create(HOST, TOKEN, ORG, BUCKET);
    }

    DeleteApi deleteApi = client.getDeleteApi();

    OffsetDateTime start = OffsetDateTime.ofInstant(Instant.parse("1970-01-01T00:00:00Z"), ZoneOffset.UTC);
    OffsetDateTime stop = OffsetDateTime.now(ZoneOffset.UTC);

    
    String predicate = String.format("_measurement=\"result\" AND \"user\"=%s", user);


    try {
        deleteApi.delete(start, stop, predicate, BUCKET, ORG);
        System.out.println("Данные пользователя " + user + " удалены");
    } catch (Exception e) {
        System.out.println("Ошибка при удалении: " + e);
    }
}

    


}
