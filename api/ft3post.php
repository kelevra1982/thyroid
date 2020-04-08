<?php

include('config.php');

$db = @mysqli_connect(HOST, USER, PASSWORD, DB);

if (!$db)
{
	echo 'false';
	exit;
}
$sql = 'INSERT INTO test (text) VALUES ("' . $_POST['text'] .'");';
$db->query($sql);

mysqli_close($db);

?>
