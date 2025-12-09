// package beans;

// import DTO.Result;
// import jakarta.ejb.Stateless;
// import java.util.ArrayList;
// import java.util.List;

// @Stateless
// public class ResultHistoryService {

//     //  Stateless не должен хранить пользовательское состояние,
//     // поэтому список существует только внутри запроса и не "приклеивается" к клиенту
//     private final List<Result> history = new ArrayList<>();

//     public List<Result> getHistory() {
//         return this.history;
//     }

//     public void addResultToHistory(Result result) {
//         this.history.add(result);
//     }
// }