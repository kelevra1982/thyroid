<?php

$db = mysqli_connect('localhost', 'd031def3', 'L7ant9QRBZW4bKzM', 'd031def3');
//$db = mysqli_connect('localhost', 'root', '', 'my-thyroid');

$sql = 'INSERT INTO test (text) VALUES ("' . $_POST['text'] .'");';
$db->query($sql);

mysqli_close($db);

?>
