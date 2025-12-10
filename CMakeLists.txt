cmake_minimum_required(VERSION 3.14)

project(SxpbTest)

set(CMAKE_CXX_STANDARD 17)

include(FetchContent)

FetchContent_Declare(
  fildesh
  GIT_REPOSITORY https://github.com/fildesh/fildesh.git
  GIT_TAG        trunk
)

FetchContent_MakeAvailable(fildesh)

# Add fildesh include directories
include_directories(${fildesh_SOURCE_DIR}/include)

add_executable(parse_test test/parse_test.cc)
# Link sxproto_lib BEFORE fildesh_lib because sxproto depends on fildesh
target_link_libraries(parse_test PRIVATE sxproto_lib fildesh_lib)
target_compile_definitions(parse_test PRIVATE "PROJECT_SOURCE_DIR=\"${CMAKE_SOURCE_DIR}\"")
