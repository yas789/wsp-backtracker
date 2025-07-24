#!/usr/bin/env bash
set -e

# 1) ensure out/ exists
mkdir -p out

# 2) gather all Java sources under FYP/WSP into a temp file
find FYP/WSP -name '*.java' > sources.txt

# 3) compile them using every JAR in lib/ on the classpath
javac -cp "lib/*" -d out @sources.txt

# 4) clean up
rm sources.txt

# 5) run your main class (adjust package if needed)
java -cp "out:lib/*" WSP.GUI.LayoutManagerDemo
