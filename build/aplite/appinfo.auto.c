#include "pebble_process_info.h"
#include "src/resource_ids.auto.h"

const PebbleProcessInfo __pbl_app_info __attribute__ ((section (".pbl_header"))) = {
  .header = "PBLAPP",
  .struct_version = { PROCESS_INFO_CURRENT_STRUCT_VERSION_MAJOR, PROCESS_INFO_CURRENT_STRUCT_VERSION_MINOR },
  .sdk_version = { PROCESS_INFO_CURRENT_SDK_VERSION_MAJOR, PROCESS_INFO_CURRENT_SDK_VERSION_MINOR },
  .process_version = { 1, 2 },
  .load_size = 0xb6b6,
  .offset = 0xb6b6b6b6,
  .crc = 0xb6b6b6b6,
  .name = "ptZgz",
  .company = "Inaki Abadia",
  .icon_resource_id = RESOURCE_ID_IMAGES_MENUIMAGE_PNG,
  .sym_table_addr = 0xA7A7A7A7,
  .flags = 0,
  .num_reloc_entries = 0xdeadcafe,
  .uuid = { 0x05, 0x6B, 0xD1, 0x0D, 0x29, 0x7A, 0x4E, 0x00, 0xA9, 0xD1, 0x36, 0x84, 0xF8, 0xDF, 0xA6, 0x86 },
  .virtual_size = 0xb6b6
};
