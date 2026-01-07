


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";





SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."cache" (
    "key" character varying(255) NOT NULL,
    "value" "text" NOT NULL,
    "expiration" integer NOT NULL
);


ALTER TABLE "public"."cache" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."cache_locks" (
    "key" character varying(255) NOT NULL,
    "owner" character varying(255) NOT NULL,
    "expiration" integer NOT NULL
);


ALTER TABLE "public"."cache_locks" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."clientes" (
    "id" integer NOT NULL,
    "nombre" "text" NOT NULL,
    "telefono" "text",
    "direccion" "text",
    "frecuencia_consumo" integer DEFAULT 20,
    "fecha_ultima_compra_gas" "date",
    "categoria" "text" DEFAULT 'Hogar'::"text",
    "fecha_ultima_compra_agua" "date",
    "frecuencia_agua" integer DEFAULT 7,
    "fecha_modificacion" timestamp without time zone,
    "usuario_modificacion" "text"
);


ALTER TABLE "public"."clientes" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."clientes_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."clientes_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."clientes_id_seq" OWNED BY "public"."clientes"."id";



CREATE TABLE IF NOT EXISTS "public"."detalle_ventas" (
    "id" integer NOT NULL,
    "venta_id" integer,
    "producto_id" integer,
    "cantidad" integer,
    "precio_unitario" numeric(10,2)
);


ALTER TABLE "public"."detalle_ventas" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."detalle_ventas_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."detalle_ventas_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."detalle_ventas_id_seq" OWNED BY "public"."detalle_ventas"."id";



CREATE TABLE IF NOT EXISTS "public"."migrations" (
    "id" integer NOT NULL,
    "migration" character varying(255) NOT NULL,
    "batch" integer NOT NULL
);


ALTER TABLE "public"."migrations" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."migrations_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."migrations_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."migrations_id_seq" OWNED BY "public"."migrations"."id";



CREATE TABLE IF NOT EXISTS "public"."personal_access_tokens" (
    "id" bigint NOT NULL,
    "tokenable_type" character varying(255) NOT NULL,
    "tokenable_id" bigint NOT NULL,
    "name" "text" NOT NULL,
    "token" character varying(64) NOT NULL,
    "abilities" "text",
    "last_used_at" timestamp(0) without time zone,
    "expires_at" timestamp(0) without time zone,
    "created_at" timestamp(0) without time zone,
    "updated_at" timestamp(0) without time zone
);


ALTER TABLE "public"."personal_access_tokens" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."personal_access_tokens_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."personal_access_tokens_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."personal_access_tokens_id_seq" OWNED BY "public"."personal_access_tokens"."id";



CREATE TABLE IF NOT EXISTS "public"."productos" (
    "id" integer NOT NULL,
    "nombre" "text" NOT NULL,
    "precio" numeric(10,2) NOT NULL,
    "es_recurrente" boolean DEFAULT false,
    "duracion_base" integer DEFAULT 20,
    "activo" boolean DEFAULT true
);


ALTER TABLE "public"."productos" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."productos_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."productos_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."productos_id_seq" OWNED BY "public"."productos"."id";



CREATE TABLE IF NOT EXISTS "public"."sessions" (
    "id" character varying(255) NOT NULL,
    "user_id" bigint,
    "ip_address" character varying(45),
    "user_agent" "text",
    "payload" "text" NOT NULL,
    "last_activity" integer NOT NULL
);


ALTER TABLE "public"."sessions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."usuarios" (
    "id" integer NOT NULL,
    "usuario" "text" NOT NULL,
    "password" "text" NOT NULL,
    "rol" "text" DEFAULT 'admin'::"text"
);


ALTER TABLE "public"."usuarios" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."usuarios_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."usuarios_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."usuarios_id_seq" OWNED BY "public"."usuarios"."id";



CREATE TABLE IF NOT EXISTS "public"."ventas" (
    "id" integer NOT NULL,
    "cliente_id" integer,
    "fecha_venta" timestamp without time zone DEFAULT "now"(),
    "total" numeric(10,2),
    "metodo_pago" "text"
);


ALTER TABLE "public"."ventas" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."ventas_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."ventas_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."ventas_id_seq" OWNED BY "public"."ventas"."id";



ALTER TABLE ONLY "public"."clientes" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."clientes_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."detalle_ventas" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."detalle_ventas_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."migrations" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."migrations_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."personal_access_tokens" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."personal_access_tokens_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."productos" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."productos_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."usuarios" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."usuarios_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."ventas" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."ventas_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."cache_locks"
    ADD CONSTRAINT "cache_locks_pkey" PRIMARY KEY ("key");



ALTER TABLE ONLY "public"."cache"
    ADD CONSTRAINT "cache_pkey" PRIMARY KEY ("key");



ALTER TABLE ONLY "public"."clientes"
    ADD CONSTRAINT "clientes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."detalle_ventas"
    ADD CONSTRAINT "detalle_ventas_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."migrations"
    ADD CONSTRAINT "migrations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."personal_access_tokens"
    ADD CONSTRAINT "personal_access_tokens_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."personal_access_tokens"
    ADD CONSTRAINT "personal_access_tokens_token_unique" UNIQUE ("token");



ALTER TABLE ONLY "public"."productos"
    ADD CONSTRAINT "productos_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."sessions"
    ADD CONSTRAINT "sessions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."usuarios"
    ADD CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."usuarios"
    ADD CONSTRAINT "usuarios_usuario_key" UNIQUE ("usuario");



ALTER TABLE ONLY "public"."ventas"
    ADD CONSTRAINT "ventas_pkey" PRIMARY KEY ("id");



CREATE INDEX "clientes_nombre_index" ON "public"."clientes" USING "btree" ("nombre");



CREATE INDEX "personal_access_tokens_expires_at_index" ON "public"."personal_access_tokens" USING "btree" ("expires_at");



CREATE INDEX "personal_access_tokens_tokenable_type_tokenable_id_index" ON "public"."personal_access_tokens" USING "btree" ("tokenable_type", "tokenable_id");



CREATE INDEX "sessions_last_activity_index" ON "public"."sessions" USING "btree" ("last_activity");



CREATE INDEX "sessions_user_id_index" ON "public"."sessions" USING "btree" ("user_id");



CREATE INDEX "ventas_cliente_id_index" ON "public"."ventas" USING "btree" ("cliente_id");



CREATE INDEX "ventas_fecha_venta_cliente_id_index" ON "public"."ventas" USING "btree" ("fecha_venta", "cliente_id");



CREATE INDEX "ventas_fecha_venta_index" ON "public"."ventas" USING "btree" ("fecha_venta");



ALTER TABLE ONLY "public"."detalle_ventas"
    ADD CONSTRAINT "detalle_ventas_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "public"."productos"("id");



ALTER TABLE ONLY "public"."detalle_ventas"
    ADD CONSTRAINT "detalle_ventas_venta_id_fkey" FOREIGN KEY ("venta_id") REFERENCES "public"."ventas"("id");



ALTER TABLE ONLY "public"."ventas"
    ADD CONSTRAINT "ventas_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "public"."clientes"("id");





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";








































































































































































GRANT ALL ON TABLE "public"."cache" TO "anon";
GRANT ALL ON TABLE "public"."cache" TO "authenticated";
GRANT ALL ON TABLE "public"."cache" TO "service_role";



GRANT ALL ON TABLE "public"."cache_locks" TO "anon";
GRANT ALL ON TABLE "public"."cache_locks" TO "authenticated";
GRANT ALL ON TABLE "public"."cache_locks" TO "service_role";



GRANT ALL ON TABLE "public"."clientes" TO "anon";
GRANT ALL ON TABLE "public"."clientes" TO "authenticated";
GRANT ALL ON TABLE "public"."clientes" TO "service_role";



GRANT ALL ON SEQUENCE "public"."clientes_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."clientes_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."clientes_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."detalle_ventas" TO "anon";
GRANT ALL ON TABLE "public"."detalle_ventas" TO "authenticated";
GRANT ALL ON TABLE "public"."detalle_ventas" TO "service_role";



GRANT ALL ON SEQUENCE "public"."detalle_ventas_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."detalle_ventas_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."detalle_ventas_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."migrations" TO "anon";
GRANT ALL ON TABLE "public"."migrations" TO "authenticated";
GRANT ALL ON TABLE "public"."migrations" TO "service_role";



GRANT ALL ON SEQUENCE "public"."migrations_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."migrations_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."migrations_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."personal_access_tokens" TO "anon";
GRANT ALL ON TABLE "public"."personal_access_tokens" TO "authenticated";
GRANT ALL ON TABLE "public"."personal_access_tokens" TO "service_role";



GRANT ALL ON SEQUENCE "public"."personal_access_tokens_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."personal_access_tokens_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."personal_access_tokens_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."productos" TO "anon";
GRANT ALL ON TABLE "public"."productos" TO "authenticated";
GRANT ALL ON TABLE "public"."productos" TO "service_role";



GRANT ALL ON SEQUENCE "public"."productos_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."productos_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."productos_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."sessions" TO "anon";
GRANT ALL ON TABLE "public"."sessions" TO "authenticated";
GRANT ALL ON TABLE "public"."sessions" TO "service_role";



GRANT ALL ON TABLE "public"."usuarios" TO "anon";
GRANT ALL ON TABLE "public"."usuarios" TO "authenticated";
GRANT ALL ON TABLE "public"."usuarios" TO "service_role";



GRANT ALL ON SEQUENCE "public"."usuarios_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."usuarios_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."usuarios_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."ventas" TO "anon";
GRANT ALL ON TABLE "public"."ventas" TO "authenticated";
GRANT ALL ON TABLE "public"."ventas" TO "service_role";



GRANT ALL ON SEQUENCE "public"."ventas_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."ventas_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."ventas_id_seq" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































