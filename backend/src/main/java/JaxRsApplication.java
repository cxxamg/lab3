
import jakarta.ws.rs.ApplicationPath;
import jakarta.ws.rs.core.Application;

@ApplicationPath("/api") // базовый путь для всех REST-эндпоинтов
public class JaxRsApplication extends Application {
    // ресурсы зарегистрируются автоматически
}
