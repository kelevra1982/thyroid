<?php

include('config.php');

$db		=	@mysqli_connect(HOST, USER, PASSWORD, DB);

if (!$db)
{
	echo 'false';
	exit;
}

$sql	=	'REPLACE INTO beschwerden (symptom1, symptom2, symptom3, symptom4, date) VALUES (' . $_POST['symptom1'] . ', ' . $_POST['symptom2'] . ', ' . $_POST['symptom3'] . ', ' . $_POST['symptom4'] . ', "' . $_POST['date'] . '");';

$db->query($sql);
mysqli_close($db);

?>
