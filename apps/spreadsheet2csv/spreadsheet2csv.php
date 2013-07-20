<?php
require 'vendor/autoload.php';
$options = getopt("f:o:");
if (count($options)<2)
{
    echo
<<<HELP
Command line utility to convert Excel spreadhseet documents to CSV files.
Required arguments:

  -f Path to the Excel spreadsheet (input)
  -o Path to the CSV output

Example usage:
   php spreadsheet2csv.php -f input.xls -o output.csv

HELP;
    exit;
}
// prevent useless output info from PHPExcel
ob_start();
$objPHPExcel = PHPExcel\IOFactory::load($options['f']);
$objWriter = PHPExcel\IOFactory::createWriter($objPHPExcel, 'CSV');
ob_end_clean();
$objWriter->save($options['o']);
