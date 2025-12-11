cmake_minimum_required(VERSION 3.14)

project(SxpbExample)

set(CMAKE_CXX_STANDARD 17)

include(FetchContent)

FetchContent_Declare(
  Fildesh
  GIT_REPOSITORY https://github.com/fildesh/fildesh.git
  GIT_TAG trunk
)

FetchContent_MakeAvailable(Fildesh)

include_directories(${Fildesh_INCLUDE_DIRS})

add_executable(parse_test test/parse_test.cc)
target_link_libraries(parse_test PRIVATE ${FildeshSxproto_LIBRARIES})

enable_testing()
add_test(NAME parse_test COMMAND parse_test "${CMAKE_SOURCE_DIR}")
