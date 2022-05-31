<?php

namespace App\Utils;

use Illuminate\Support\Facades\Log;

class LogHelper
{
  public static function debug(array $params = []): void
  {
    // get backtrace
    $str = self::getStr($params);

    Log::debug($str);
  }

  public static function error(array $params = []): void
  {
    // get backtrace
    $str = self::getStr($params);

    Log::error($str);
  }

  public static function info(array $params = []): void
  {
    // get backtrace
    $str = self::getStr($params);

    Log::info($str);
  }

  /**
   * @param array $params
   * @return string
   */
  public static function getStr(array $params): string
  {
    $backTrace = debug_backtrace();

    $func = $backTrace[2]['function'];
    $class = $backTrace[2]['class'];
    $line = $backTrace[2]['line'];

    // standard string
    $str = "Class ~> " . $class . "::" . $func . "@line ~> #" . $line;

    // optional parameters
    foreach ($params as $label => $value) {
      $str .= " " . $label . " ~> ";

      if (is_array($value) || is_object($value)) {
        $str .= var_export($value, true);
      } else {
        $str .= $value;
      }
    }
    return $str;
  }
}
