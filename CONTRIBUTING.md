# Development

## Python Test
```shell
pdm lock
pdm install
pdm test
```

## Python Lint & Tidy
```shell
uv tool install ruff
uv tool run ruff check --fix .
uv tool run ruff format .
```

## JavaScript Test
```shell
npm install
npm test
```

## JavaScript Lint & Tidy
```shell
npx --yes eslint --fix .
npx --yes prettier --write .
```

## C++ Test
The project uses `cmake`.
```shell
cmake -S . -B bld
cmake --build bld
ctest --test-dir bld
```

## C++ Lint & Tidy
```shell
find test -name "*.cc" -exec clang-format --style=Mozilla -i {} +
```
