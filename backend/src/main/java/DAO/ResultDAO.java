package DAO;

import java.util.logging.Logger;

import com.influxdb.client.InfluxDBClient;
import com.influxdb.client.InfluxDBClientFactory;
import com.influxdb.client.QueryApi;
import com.influxdb.client.WriteApiBlocking;
import com.influxdb.client.write.Point;

import DTO.Result;

public class ResultDAO{
     private static final Logger logger = Logger.getLogger(ResultDAO.class.getName());
    private static InfluxDBClient client;
    private static  String BUCKET = null;
    private static  String HOST = null;
    private static  char[] TOKEN = null;
    private static  String ORG = null;
    
    private static void getProperties(){
        String[] props = ReaderEnv.readerEnv();
        BUCKET = props[4];
        HOST = props[0];
        TOKEN = props[1].toCharArray();
        ORG = props[2];
    }

    public static void instantiate(Result result, String user){
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
            writeData(client, result, user);
            queryLastPoint(client, user);
            //queryData(client);
        } catch (Exception e) {
            logger.info(e.toString());
        }

    }

    private static void writeData(InfluxDBClient client, Result result, String user){
        getProperties();
        logger.info(BUCKET + HOST + TOKEN.toString() + ORG);
        Point point = Point.measurement("result")
            .addTag("user", user)
            .addField("x", result.x())
            .addField("y", result.y())
            .addField("r", result.r())
            .addField("hit", result.hit())
            .addField("scriptTime", result.scriptTime())
            .addField("serverTime", result.serverTime());
        try {
            WriteApiBlocking writeApi = client.getWriteApiBlocking();
            writeApi.writePoint(BUCKET, ORG, point);
            logger.info("Данные отправились в базу "+ ORG + BUCKET);
        } catch (Exception e) {
            logger.info("Данные не отправились: "+ e.toString());
        }
    }

    private static void queryData(InfluxDBClient client){
        //String sql = "SELECT * FROM \"result\" WHERE user == \"log_test\"";
        String fluxRequest = String.format("""
                                           from(bucket: "%s") |> range(start: 0)
                                             |> filter(fn: (r) => r["_measurement"] == "result")
                                             |> filter(fn: (r) => r["user"] == "log_test")
                                             |> filter(fn: (r) => r["_field"] == "x")""" //
        //
        //
        ,
                BUCKET);
        try {
            QueryApi queryApi = client.getQueryApi();
            queryApi.query(fluxRequest, (cancellable, record) -> {
                System.out.println(record.getValues().get("_value"));
            });
        } catch (Exception e) {
            logger.info("Данные не взялись из таблицы: " + e.toString());
        }
       
    }

    private static void queryLastPoint(InfluxDBClient client, String targetUser){
    String fluxRequest = String.format("""
        from(bucket: "%s")
          |> range(start: 0)
          |> filter(fn: (r) => r["_measurement"] == "result")
          |> filter(fn: (r) => r["user"] == "%s")
          |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
          |> sort(columns: ["_time"], desc: true)
          |> limit(n:1)
    """, BUCKET, targetUser);

    try {
        QueryApi queryApi = client.getQueryApi();
        queryApi.query(fluxRequest, (cancellable, record) -> {

            Double x = (Double) record.getValueByKey("x");
            Double y = (Double) record.getValueByKey("y");
            Double r = (Double) record.getValueByKey("r");
            Boolean hit = (Boolean) record.getValueByKey("hit");
            Double scriptTime = ((Double) record.getValueByKey("scriptTime"));
            String serverTime = ((String) record.getValueByKey("serverTime"));

            System.out.printf("x=%s y=%s r=%s hit=%s serverTime=%s scriptTime=%s%n",
                    x, y, r, hit, serverTime, scriptTime);
        });
    } catch (Exception e) {
        logger.info("Ошибка чтения: " + e);
    }
}

}
