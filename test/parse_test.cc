#include <filesystem>
#include <iostream>
#include <string>
#include <vector>

#include <fildesh/sxproto.h>

int main() {
  std::string source_dir = PROJECT_SOURCE_DIR;
  std::string dirs_sxpb_path = source_dir + "/test/dirs.sxpb";

  FildeshX* in = open_FildeshXF(dirs_sxpb_path.c_str());
  if (!in) {
    std::cerr << "Could not open " << dirs_sxpb_path << std::endl;
    return 1;
  }

  FildeshO* stderr_out = open_FildeshOF("/dev/stderr");
  FildeshSxpb* sxpb = slurp_sxpb_close_FildeshX(in, NULL, stderr_out);
  if (!sxpb) {
    std::cerr << "Failed to parse " << dirs_sxpb_path << std::endl;
    return 1;
  }

  FildeshSxpbIT top = top_of_FildeshSxpb(sxpb);
  FildeshSxpbIT dirs_it = lookup_subfield_at_FildeshSxpb(sxpb, top, "dirs");

  if (nullish_FildeshSxpbIT(dirs_it)) {
    std::cerr << "No 'dirs' field in " << dirs_sxpb_path << std::endl;
    close_FildeshSxpb(sxpb);
    return 1;
  }

  std::vector<std::string> dirs;
  for (FildeshSxpbIT it = first_at_FildeshSxpb(sxpb, dirs_it);
       !nullish_FildeshSxpbIT(it);
       it = next_at_FildeshSxpb(sxpb, it)) {
    dirs.push_back(str_value_at_FildeshSxpb(sxpb, it));
  }

  close_FildeshSxpb(sxpb);

  bool success = true;
  for (const auto& dir : dirs) {
    namespace fs = std::filesystem;
    fs::path dir_path = fs::path(source_dir) / dir;
    if (!fs::exists(dir_path)) continue;

    for (const auto& entry : fs::recursive_directory_iterator(dir_path)) {
      if (entry.is_regular_file() && entry.path().extension() == ".sxpb") {
        const std::string filepath = entry.path().string();

        // Validation
        FildeshX* file_in = open_FildeshXF(filepath.c_str());
        if (!file_in) {
          std::cerr << "Cannot open " << filepath << std::endl;
          success = false;
          continue;
        }
        FildeshSxpb* file_sxpb = slurp_sxpb_close_FildeshX(file_in, NULL, stderr_out);
        if (file_sxpb) {
          std::cout << "Validated " << filepath << std::endl;
          close_FildeshSxpb(file_sxpb);
        } else {
          std::cerr << "Validation failed for " << filepath << std::endl;
          success = false;
        }
      }
    }
  }

  close_FildeshO(stderr_out);

  return success ? 0 : 1;
}
