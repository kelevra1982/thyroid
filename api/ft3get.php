<?php

include('config.php');

$db			=	@mysqli_connect(HOST, USER, PASSWORD, DB);
$sql		=	'SELECT * FROM ft3 ORDER BY date ASC;';
$result		=	$db->query($sql);
$return		=	[];

while ($row	=	$result->fetch_assoc())
{
	array_push($return, $row);
}

mysqli_close($db);
echo json_encode($return);

?>
