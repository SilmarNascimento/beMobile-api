# Espera até que o banco de dados esteja pronto
echo "Esperando o banco de dados estar pronto..."
until nc -z -v -w30 mysql 3306
do
  echo "Esperando o banco de dados..."
  sleep 5
done

# Rodar as migrações
echo "Rodando migrações..."
node ace migration:run
