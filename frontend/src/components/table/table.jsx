export function Table({points}) {
    return (
    <div id="left_column">
        <div id="current_result_details">
        <table>
            <thead>
            <tr>
                <th>X</th>
                <th>Y</th>
                <th>R</th>
                <th>Попадание</th>
                <th>Текущее время</th>
                <th>Время работы скрипта (мс)</th>
            </tr>
            </thead>
            <tbody>
            {points.map((point, index) => (
            <tr key={index}>
                <td>{point.x}</td>
                <td>{point.y}</td>
                <td>{point.r}</td>
                <td>{point.hit ? "Да" : "Нет"}</td>
                <td>{point.serverTime}</td>
                <td>{point.scriptTime}</td>
            </tr>
             ))}

            </tbody>
        </table>
        </div>
    </div>

    )
}