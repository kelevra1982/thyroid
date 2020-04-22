<?php

include('config.php');

$db		=	@mysqli_connect(HOST, USER, PASSWORD, DB);

if (!$db)
{
	echo 'false';
	exit;
}

$value	=	explode(',', $_POST['value']);
$sql	=	'INSERT INTO vitamind (before_comma, after_comma, date) VALUES (' . $value[0] . ',' . $value[1] . ', "' . $_POST['date'] . '");';

$db->query($sql);
mysqli_close($db);

?>
