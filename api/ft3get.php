<?php

include('config.php');

$db = @mysqli_connect(HOST, USER, PASSWORD, DB);

$sql = 'SELECT * FROM test;';
$result = $db->query($sql);
$return = [];
while ($row = $result->fetch_assoc())
{
	array_push($return, $row);
}

mysqli_close($db);

echo json_encode($return);

?>
