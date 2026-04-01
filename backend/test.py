import somtoday

username = "LL522517"
password = "eix8Cai#"
tenant_uuid = "7f69059a-7a2b-4e01-9c9b-9d2802869d58"

s = somtoday.get_grades_subjects("uname_pword", username, password, tenant_uuid)

print(s)