tmp_dir="$(mktemp -d)" &&
git clone --depth 1 https://github.com/EveryInc/compound-engineering-plugin.git "$tmp_dir/compound-engineering-plugin" &&
mkdir -p .agents/skills &&
cp -R "$tmp_dir/compound-engineering-plugin/skills/." .agents/skills/ &&
find .agents/skills -mindepth 2 -maxdepth 2 -name SKILL.md | sort &&
rm -rf "$tmp_dir"