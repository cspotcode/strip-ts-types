param(
    $script = $env:npm_lifecycle_event
)
$ErrorActionPreference = 'Stop'

Function run($script) {
    switch($script) {
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
            $userDataDir = "$( ( gi . ).FullName )/.chromeUserDataDir"
            start-process -passthru -FilePath 'C:\Program Files (x86)\Google\Chrome\Application\chrome.exe' -ArgumentList @(
                "--user-data-dir=$userDataDir", "localhost:9000")
        }
        test {

        }
        publish-site {
            pushd out
            git add -A
            git commit -m "Updating site"
            # git fetch
            # git rebase
            git push
            popd
        }
    }
}

run $script
