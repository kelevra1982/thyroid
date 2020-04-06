<?php

$db = mysqli_connect('localhost', 'd031def3', 'L7ant9QRBZW4bKzM', 'd031def3');

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
