# Fork of the magic mirror weather module

## Install

- Change into your modules directory (Example):

  - `cd ~/MagicMirror/Modules`

- Clone the module into that folder:

* `git clone https://github.com/tticehurst/TomWeather.git`

- Change into the new module directory:

  - `cd TomWeather`

- Install the required dependencies for the module:
  - `npm install`

## Config

| Option | Description                                               | Example             |
| ------ | --------------------------------------------------------- | ------------------- |
| appID  | The api key / app id for open weather map                 | `appID: "abcd1234"` |
| lat    | The latitude of the area you would like the forecast for  | `lat: "1.2345678"`  |
| long   | The longitude of the area you would like the forecast for | `lon: "1.12345678"` |
| unit   | The unit you would like the forecast in                   | `unit: "metric"`    |

## Example

![example image](https://i.imgur.com/JVnUAyi.png)
