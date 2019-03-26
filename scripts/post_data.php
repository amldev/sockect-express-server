<?php header('Content-Type: application/json'); 
$rawData = file_get_contents("php://input");

    // this returns null if not valid json
$values = json_decode($rawData);
echo $values->nombre;
$reservas = $values->values;
echo ' - ';
echo sizeof($reservas);
for ($i = 0; $i <= sizeof($reservas); $i++) {
    echo '<p>';
    echo ($reservas[$i]->client->name);
    echo '</p>';
}
?>