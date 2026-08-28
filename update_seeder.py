import re

with open(r'backend/product-service/src/main/java/com/ecommerce/product/config/DataSeeder.java', 'r', encoding='utf-8') as f:
    content = f.read()

count = 1
def replace_url(match):
    global count
    new_url = f'https://loremflickr.com/600/600/perfume?lock={count}'
    count += 1
    return match.group(1) + '"' + new_url + '"' + match.group(3)

new_content = re.sub(r'(buildProduct\(.*?,\s*)"https://images\.unsplash\.com[^"]+"(\s*\));', replace_url, content)

with open(r'backend/product-service/src/main/java/com/ecommerce/product/config/DataSeeder.java', 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f'Replaced {count-1} URLs')
