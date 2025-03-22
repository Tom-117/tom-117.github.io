<?php
header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');

while (true) {
    $time = date('H:i:s');
    $randomNumber = rand(1, 100);
    
    echo "data: {\"time\": \"$time\", \"value\": $randomNumber}\n\n";
    
    ob_flush();
    flush();
    sleep(2);
}
?>
    