<?
$MAX=20;
$row_array = file('scores.txt');
$final_array = array();
$c=0;

$score= (int)htmlspecialchars($_REQUEST['score']);
$name=htmlspecialchars($_REQUEST['name']);
$output="";

if($score<>"" && $name<>"") $final_array[$c++] = array($name, $score);

foreach ($row_array as $row) {
    	$temp_array = explode(':', $row);
        if(trim($temp_array[0])<>"") {
	if($c<$MAX)$final_array[$c++] = array($temp_array[0],$temp_array[1]); 
	}
}
?><table border="1" cellpadding=4 cellspacing=0>
<tr style="background:#ccc">
	<td>Name</td>
	<td width=70 align="right">Score</td>
</tr><?
foreach ($final_array as $x) {
   $name1=$x[0];
   $score1=$x[1];
   if(trim($name1<>"")) {
   if($output<>"") $output.="\n";
   $output.=$name1.":".$score1;
   echo "<tr><td>".$name1."</td><td align='right'>".$score1."</td></tr>";
   }
}
?></table><?

if($score<>"" && $name<>"") file_put_contents("scores.txt", $output);
?>
