-- PostIt Casa — Script de criação e população do banco de dados
-- PostgreSQL

-- Criar banco (execute separadamente se necessário)
-- CREATE DATABASE postitcasa;

-- Tabela de bilhetes
DROP TABLE IF EXISTS bilhetes;

CREATE TABLE bilhetes (
  id          SERIAL PRIMARY KEY,
  titulo      VARCHAR(100) NOT NULL,
  mensagem    TEXT,
  tipo        VARCHAR(20) NOT NULL CHECK (tipo IN ('recado', 'lista', 'reuniao')),
  cor         VARCHAR(20) NOT NULL CHECK (cor IN ('amarelo', 'rosa', 'verde', 'azul', 'laranja')),
  autor       VARCHAR(50) NOT NULL,
  horario     TIMESTAMP,
  itens_lista JSONB,
  criado_em   TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Dados de exemplo
INSERT INTO bilhetes (titulo, mensagem, tipo, cor, autor) VALUES
  ('Pagar conta de luz', 'Vence na sexta-feira! Não esqueça.', 'recado', 'amarelo', 'João');

INSERT INTO bilhetes (titulo, tipo, cor, autor, itens_lista) VALUES
  ('Compras do mês', 'lista', 'verde', 'Maria', '["Arroz", "Feijão", "Ovos", "Leite", "Pão"]');

INSERT INTO bilhetes (titulo, mensagem, tipo, cor, autor, horario) VALUES
  ('Reunião de família', 'Vamos conversar sobre as férias de julho.', 'reuniao', 'rosa', 'Pai', '2026-06-20 19:00:00');

INSERT INTO bilhetes (titulo, mensagem, tipo, cor, autor) VALUES
  ('Cachorro', 'Alguém pode levar o Rex para passear hoje à tarde?', 'recado', 'azul', 'Ana');

INSERT INTO bilhetes (titulo, tipo, cor, autor, itens_lista) VALUES
  ('Farmácia', 'lista', 'laranja', 'Mãe', '["Dipirona", "Band-aid", "Protetor solar"]');
