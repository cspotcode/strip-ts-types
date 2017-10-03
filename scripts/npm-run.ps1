$ErrorActionPreference = 'Stop'

switch($env:npm_lifecycle_event) {
    build {
        webpack
    }
    watch {
        webpack --watch
    }
    start {
        # webpack-dev-server --open
        webpack-dev-server
    }
    start-browser {
        $userDataDir = "$( ( gi . ).FullName )/chromeUserDataDir"
        start-process -passthru -FilePath 'C:\Program Files (x86)\Google\Chrome\Application\chrome.exe' -ArgumentList @(
            "--user-data-dir=$userDataDir", "localhost:9000")
    }
    test {

    }
}