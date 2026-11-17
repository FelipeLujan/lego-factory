#!/bin/zsh
# Frees internal-SSD space taken by FINISHED council agent conversations (DealCalm revamp, AI boom, Disney, dot-com r1).
# The Antigravity server (agy) keeps every conversation database open, so run this only while agy is NOT running:
#   quit every agy / Antigravity window, then:  zsh "/Volumes/Lexar/lego factory/scripts/flush_council_conversations.sh"
# It deletes only the conversation IDs listed in finished_council_conversations.txt (never the main session 6c650f52…).
set -e
A="$HOME/.gemini/antigravity-cli"
LIST="$(dirname "$0")/finished_council_conversations.txt"
if pgrep -x agy >/dev/null; then echo "agy is still running: quit it first (pgrep -x agy)."; exit 1; fi
before=$(df -k /System/Volumes/Data | tail -1 | awk '{print $4}')
n=0
while read id; do
  [[ ${#id} -eq 36 && "$id" != 6c650f52-fbe9-43bb-97c6-c660c7ec3a2b ]] || continue
  rm -f "$A/conversations/$id.db" "$A/conversations/$id.db-wal" "$A/conversations/$id.db-shm"
  rm -rf "$A/brain/$id"
  n=$((n+1))
done < "$LIST"
after=$(df -k /System/Volumes/Data | tail -1 | awk '{print $4}')
echo "Removed $n finished council conversations; freed $(( (after-before)/1024 )) MB."
