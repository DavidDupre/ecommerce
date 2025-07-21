--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pgagent; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA pgagent;


ALTER SCHEMA pgagent OWNER TO postgres;

--
-- Name: SCHEMA pgagent; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA pgagent IS 'pgAgent system tables';


--
-- Name: pgagent; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgagent WITH SCHEMA pgagent;


--
-- Name: EXTENSION pgagent; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgagent IS 'A PostgreSQL job scheduler';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: transaction_orm_entity_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.transaction_orm_entity_status_enum AS ENUM (
    'PENDING',
    'APPROVED',
    'DECLINED',
    'ERROR'
);


ALTER TYPE public.transaction_orm_entity_status_enum OWNER TO postgres;

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at_column() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    stock integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    category character varying(50) NOT NULL
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transactions (
    products jsonb NOT NULL,
    "totalAmount" numeric(10,2) NOT NULL,
    status character varying NOT NULL,
    "customerEmail" character varying NOT NULL,
    "customerName" character varying NOT NULL,
    "deliveryAddress" character varying NOT NULL,
    city character varying NOT NULL,
    "postalCode" character varying NOT NULL,
    "phoneNumber" character varying NOT NULL,
    "shippingCost" numeric(10,2) NOT NULL,
    "trackingNumber" character varying,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    id character varying NOT NULL
);


ALTER TABLE public.transactions OWNER TO postgres;

--
-- Data for Name: pga_jobagent; Type: TABLE DATA; Schema: pgagent; Owner: postgres
--

COPY pgagent.pga_jobagent (jagpid, jaglogintime, jagstation) FROM stdin;
9056	2025-07-20 21:44:25.146296-05	DESKTOP-JV6DKL5
\.


--
-- Data for Name: pga_jobclass; Type: TABLE DATA; Schema: pgagent; Owner: postgres
--

COPY pgagent.pga_jobclass (jclid, jclname) FROM stdin;
\.


--
-- Data for Name: pga_job; Type: TABLE DATA; Schema: pgagent; Owner: postgres
--

COPY pgagent.pga_job (jobid, jobjclid, jobname, jobdesc, jobhostagent, jobenabled, jobcreated, jobchanged, jobagentid, jobnextrun, joblastrun) FROM stdin;
\.


--
-- Data for Name: pga_schedule; Type: TABLE DATA; Schema: pgagent; Owner: postgres
--

COPY pgagent.pga_schedule (jscid, jscjobid, jscname, jscdesc, jscenabled, jscstart, jscend, jscminutes, jschours, jscweekdays, jscmonthdays, jscmonths) FROM stdin;
\.


--
-- Data for Name: pga_exception; Type: TABLE DATA; Schema: pgagent; Owner: postgres
--

COPY pgagent.pga_exception (jexid, jexscid, jexdate, jextime) FROM stdin;
\.


--
-- Data for Name: pga_joblog; Type: TABLE DATA; Schema: pgagent; Owner: postgres
--

COPY pgagent.pga_joblog (jlgid, jlgjobid, jlgstatus, jlgstart, jlgduration) FROM stdin;
\.


--
-- Data for Name: pga_jobstep; Type: TABLE DATA; Schema: pgagent; Owner: postgres
--

COPY pgagent.pga_jobstep (jstid, jstjobid, jstname, jstdesc, jstenabled, jstkind, jstcode, jstconnstr, jstdbname, jstonerror, jscnextrun) FROM stdin;
\.


--
-- Data for Name: pga_jobsteplog; Type: TABLE DATA; Schema: pgagent; Owner: postgres
--

COPY pgagent.pga_jobsteplog (jslid, jsljlgid, jsljstid, jslstatus, jslresult, jslstart, jslduration, jsloutput) FROM stdin;
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, name, description, price, stock, created_at, updated_at, category) FROM stdin;
67847a43-2c99-425f-b679-21c9bc734dec	Memoria RAM Kingston 16GB 3200MHz	Memoria DDR4 para PC, CL16	89.99	50	2025-07-19 22:52:26.171713-05	2025-07-20 11:01:16.097735-05	Componentes
9bfded24-07cd-4452-97b0-2e2cf538e951	Monitor LG 27GL850-B	Monitor gaming 27" QHD Nano IPS 144Hz	349.99	15	2025-07-19 22:52:26.171713-05	2025-07-20 11:01:16.097735-05	Monitores
03354ab2-33f3-4408-96fa-ccedfe952e54	SSD Samsung 970 EVO Plus 1TB	SSD NVMe M.2, velocidades hasta 3500MB/s	129.99	40	2025-07-19 22:52:26.171713-05	2025-07-20 11:01:16.097735-05	Almacenamiento
a6a624ee-c11a-435c-8120-25cfdb04963b	Chasis Corsair iCUE 4000X	Gabinete con ventiladores RGB y panel de vidrio templado	119.99	20	2025-07-19 22:52:26.171713-05	2025-07-20 11:01:16.097735-05	Gabinetes
f20dd887-eacc-4442-a038-5fe4d1be1cd3	Tarjeta Gr┬áfica RTX 3060 Ti	8GB GDDR6, HDMI, DisplayPort	399.99	10	2025-07-19 22:52:26.171713-05	2025-07-20 11:01:16.097735-05	Componentes
205d8ffc-2efb-416d-a479-557d327a75e0	Webcam Logitech C920	1080p, micr┬ófono integrado	79.99	18	2025-07-19 22:52:26.171713-05	2025-07-20 11:01:16.097735-05	Accesorios
95bcdd4a-786c-45b7-a206-a6a904ad25b9	Router ASUS RT-AX82U	WiFi 6 AX5400, gaming	179.99	12	2025-07-19 22:52:26.171713-05	2025-07-20 11:01:16.097735-05	Redes
97466c2d-cb5d-47af-ac5c-727f06705192	Mouse Logitech G502 Hero	Mouse gaming con sensor HERO 25K	59.99	30	2025-07-19 22:52:26.171713-05	2025-07-20 11:02:36.995199-05	Perifericos
0f84a6db-c894-4fac-ae7c-f74a632048a1	Teclado Mec┬ánico Redragon K552	Teclado gaming mec┬ánico con switches Outemu Blue	69.99	25	2025-07-19 22:52:26.171713-05	2025-07-20 11:02:36.995199-05	Perifericos
615398da-5cc5-46b5-884e-8627e7d247ef	Disipador Cooler Master Hyper 212	Cooler CPU con ventilador PWM	39.99	35	2025-07-19 22:52:26.171713-05	2025-07-20 11:02:36.995199-05	Refrigeracion
\.


--
-- Data for Name: transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transactions (products, "totalAmount", status, "customerEmail", "customerName", "deliveryAddress", city, "postalCode", "phoneNumber", "shippingCost", "trackingNumber", "createdAt", "updatedAt", id) FROM stdin;
[{"price": "129.99", "quantity": 1, "productId": "03354ab2-33f3-4408-96fa-ccedfe952e54"}]	139.99	DECLINED	test@example.com	Test User	Calle 123	Bogot├í	110111	3001234567	10.00	WM582556278484	2025-07-20 13:03:02.565229	2025-07-20 13:03:02.565229	txn-8775ed1a-d0fc-4cf3-a816-f73583590987
[{"price": "129.99", "quantity": 1, "productId": "03354ab2-33f3-4408-96fa-ccedfe952e54"}]	139.99	DECLINED	test@example.com	Test User	Calle 123	Bogot├í	110111	3001234567	10.00	WM597240864303	2025-07-20 13:03:17.244584	2025-07-20 13:03:17.244584	txn-90f7857b-f473-4b12-9e61-72a4b75752eb
[{"price": "129.99", "quantity": 1, "productId": "03354ab2-33f3-4408-96fa-ccedfe952e54"}]	139.99	DECLINED	test@example.com	Test User	Calle 123	Bogot├í	110111	3001234567	10.00	WM651327804578	2025-07-20 13:04:11.330814	2025-07-20 13:04:11.330814	txn-ecbf7c2b-16f2-4eb7-8ccb-1a3a6f127a7c
[{"price": "129.99", "quantity": 1, "productId": "03354ab2-33f3-4408-96fa-ccedfe952e54"}]	139.99	DECLINED	test@example.com	Test User	Calle 123	Bogot├í	110111	3001234567	10.00	WM660111942710	2025-07-20 13:04:20.11448	2025-07-20 13:04:20.11448	txn-d422de2e-d157-4b20-9f9e-50e2f6048bf1
[{"price": "129.99", "quantity": 1, "productId": "03354ab2-33f3-4408-96fa-ccedfe952e54"}]	139.99	DECLINED	test@example.com	Test User	Calle 123	Bogot├í	110111	3001234567	10.00	WM667563578018	2025-07-20 13:04:27.565705	2025-07-20 13:04:27.565705	txn-6f2f680b-c09f-4a76-89c6-9e3afdbb517a
[{"price": "129.99", "quantity": 1, "productId": "03354ab2-33f3-4408-96fa-ccedfe952e54"}]	139.99	DECLINED	test@example.com	Test User	Calle 123	Bogot├í	110111	3001234567	10.00	WM214221753774	2025-07-20 13:13:34.228116	2025-07-20 13:13:34.228116	txn-62873168-7418-47ae-8fbc-1413feb27328
[{"price": "129.99", "quantity": 1, "productId": "03354ab2-33f3-4408-96fa-ccedfe952e54"}]	139.99	DECLINED	test@example.com	Test User	Calle 123	Bogot├í	110111	3001234567	10.00	WM328371922358	2025-07-20 13:15:28.374437	2025-07-20 13:15:28.374437	txn-9f4a0237-abc1-4225-89e8-826f7bd18e76
[{"price": "129.99", "quantity": 1, "productId": "03354ab2-33f3-4408-96fa-ccedfe952e54"}]	139.99	DECLINED	test@example.com	Test User	Calle 123	Bogot├í	110111	3001234567	10.00	WM381575579481	2025-07-20 13:16:21.579004	2025-07-20 13:16:21.579004	txn-bdf32794-4564-46ef-9605-bf62d04ee8d7
[{"price": "129.99", "quantity": 1, "productId": "03354ab2-33f3-4408-96fa-ccedfe952e54"}]	139.99	DECLINED	test@example.com	Test User	Calle 123	Bogot├í	110111	3001234567	10.00	WM792021987309	2025-07-20 13:23:12.024263	2025-07-20 13:23:12.024263	txn-e7ff6d57-9ea7-43a4-aa5a-d203a9d48ea9
[{"price": "89.99", "quantity": 1, "productId": "67847a43-2c99-425f-b679-21c9bc734dec"}]	99.99	DECLINED	test@example.com	Test User	Calle 123	Bogot├í	110111	3001234567	10.00	WM124550342153	2025-07-20 13:28:44.557557	2025-07-20 13:28:44.557557	txn-143913ba-8c94-4a9c-8c48-556bd5512f63
[{"price": "89.99", "quantity": 1, "productId": "67847a43-2c99-425f-b679-21c9bc734dec"}]	99.99	DECLINED	test@example.com	Test User	Calle 123	Bogot├í	110111	3001234567	10.00	WM295796389094	2025-07-20 13:31:35.802888	2025-07-20 13:31:35.802888	txn-a3272edc-ef42-413b-876a-0734106c3070
[{"price": "89.99", "quantity": 1, "productId": "67847a43-2c99-425f-b679-21c9bc734dec"}]	99.99	DECLINED	test@example.com	Test User	Calle 123	Bogot├í	110111	3001234567	10.00	WM428668415141	2025-07-20 13:33:48.671587	2025-07-20 13:33:48.671587	txn-3a29955d-cf1b-45e6-b879-ed1f75ea74e0
[{"price": "89.99", "quantity": 1, "productId": "67847a43-2c99-425f-b679-21c9bc734dec"}]	99.99	DECLINED	test@example.com	Juan P├®rez	Calle 123 #45-67	Bogot├í	110111	573001234567	10.00	WM032150566661	2025-07-20 13:43:52.157051	2025-07-20 13:43:52.157051	txn-e460f647-0af2-4058-901c-05accf1b98ff
[{"price": "89.99", "quantity": 1, "productId": "67847a43-2c99-425f-b679-21c9bc734dec"}]	99.99	DECLINED	test@example.com	Juan P├®rez	Calle 123 #45-67	Bogot├í	110111	573001234567	10.00	WM142926504692	2025-07-20 13:45:42.929379	2025-07-20 13:45:42.929379	txn-9e4b93e9-3b9b-4d0e-86c1-0af8538cc91d
[{"price": "89.99", "quantity": 1, "productId": "67847a43-2c99-425f-b679-21c9bc734dec"}]	99.99	DECLINED	test@example.com	Juan P├®rez	Calle 123 #45-67	Bogot├í	110111	573001234567	10.00	WM500913625676	2025-07-20 13:51:40.917848	2025-07-20 13:51:40.917848	txn-c789c4bf-52f2-4e01-8750-1ca621f26f6a
[{"price": "89.99", "quantity": 1, "productId": "67847a43-2c99-425f-b679-21c9bc734dec"}]	99.99	DECLINED	test@example.com	Juan P├®rez	Calle 123 #45-67	Bogot├í	110111	573001234567	10.00	WM519516576796	2025-07-20 13:51:59.522571	2025-07-20 13:51:59.522571	txn-bd840fc3-d1c4-4571-8375-644c16f64de8
[{"price": "89.99", "quantity": 1, "productId": "67847a43-2c99-425f-b679-21c9bc734dec"}]	99.99	PENDING	test@example.com	Juan P├®rez	Calle 123 #45-67	Bogot├í	110111	573001234567	10.00	WM682722461260	2025-07-20 13:54:42.728413	2025-07-20 13:54:42.728413	txn-e2814f8f-9461-4257-8e79-731492a7944a
[{"price": "89.99", "quantity": 1, "productId": "67847a43-2c99-425f-b679-21c9bc734dec"}]	99.99	PENDING	test@example.com	Juan P├®rez	Calle 123 #45-67	Bogot├í	110111	573001234567	10.00	WM745236559933	2025-07-20 13:55:45.239947	2025-07-20 13:55:45.239947	txn-4696c5ec-60ff-4962-924c-f5d9b6e70ac6
[{"price": "89.99", "quantity": 1, "productId": "67847a43-2c99-425f-b679-21c9bc734dec"}]	99.99	PENDING	test@example.com	Juan P├®rez	Calle 123 #45-67	Bogot├í	110111	573001234567	10.00	WM759811513031	2025-07-20 13:55:59.814432	2025-07-20 13:55:59.814432	txn-b7c0d82e-8626-4ee8-8ba3-a0b10c1027f2
[{"price": "89.99", "quantity": 1, "productId": "67847a43-2c99-425f-b679-21c9bc734dec"}]	99.99	DECLINED	test@example.com	Juan P├®rez	Calle 123 #45-67	Bogot├í	110111	573001234567	10.00	WM796773182285	2025-07-20 13:56:36.776135	2025-07-20 13:56:36.776135	txn-14980309-8fed-479a-afe5-452f4a4cde60
[{"price": "89.99", "quantity": 1, "productId": "67847a43-2c99-425f-b679-21c9bc734dec"}]	10089.99	DECLINED	test@example.com	Juan P├®rez	Calle 123 #45-67	Bogot├í	110111	573001234567	10000.00	WM836956197617	2025-07-20 13:57:16.962363	2025-07-20 13:57:16.962363	txn-d658084f-c781-49e5-9298-c6ba09c29bb1
[{"price": "89.99", "quantity": 1, "productId": "67847a43-2c99-425f-b679-21c9bc734dec"}]	10089.99	DECLINED	test@example.com	Juan P├®rez	Calle 123 #45-67	Bogot├í	110111	573001234567	10000.00	WM856357632587	2025-07-20 13:57:36.362593	2025-07-20 13:57:36.362593	txn-7668af05-6818-478e-85dc-d2f21904ad91
[{"price": "89.99", "quantity": 1, "productId": "67847a43-2c99-425f-b679-21c9bc734dec"}]	10089.99	DECLINED	test@example.com	Juan P├®rez	Calle 123 #45-67	Bogot├í	110111	573001234567	10000.00	WM060013505765	2025-07-20 14:01:00.019646	2025-07-20 14:01:00.019646	txn-5ecfe12c-414c-4d9f-a671-7a9806d8a8a5
[{"price": "89.99", "quantity": 1, "productId": "67847a43-2c99-425f-b679-21c9bc734dec"}]	10089.99	DECLINED	test@example.com	Juan P├®rez	Calle 123 #45-67	Bogot├í	110111	573001234567	10000.00	WM200640494035	2025-07-20 14:03:20.645795	2025-07-20 14:03:20.645795	txn-b8b9e277-8aba-4590-8a89-7610694396d9
[{"price": "89.99", "quantity": 1, "productId": "67847a43-2c99-425f-b679-21c9bc734dec"}]	10089.99	DECLINED	test@example.com	Juan P├®rez	Calle 123 #45-67	Bogot├í	110111	573001234567	10000.00	WM450607792558	2025-07-20 14:07:30.612726	2025-07-20 14:07:30.612726	txn-e711e421-8cfe-40fa-8b1e-eab014ec2ed2
[{"price": "89.99", "quantity": 1, "productId": "67847a43-2c99-425f-b679-21c9bc734dec"}]	10089.99	DECLINED	test@example.com	Juan P├®rez	Calle 123 #45-67	Bogot├í	110111	573001234567	10000.00	WM636660239262	2025-07-20 14:10:36.666028	2025-07-20 14:10:36.666028	txn-b44ab9e3-8f48-42b4-87cf-bfb6fbe18144
[{"price": "89.99", "quantity": 1, "productId": "67847a43-2c99-425f-b679-21c9bc734dec"}]	10089.99	DECLINED	test@example.com	Juan P├®rez	Calle 123 #45-67	Bogot├í	110111	573001234567	10000.00	WM644272550387	2025-07-20 14:10:44.27404	2025-07-20 14:10:44.27404	txn-8bcbfdce-936d-4d45-9cfe-12bae45fb6f0
[{"price": "89.99", "quantity": 1, "productId": "67847a43-2c99-425f-b679-21c9bc734dec"}]	10089.99	DECLINED	test@example.com	Juan P├®rez	Calle 123 #45-67	Bogot├í	110111	573001234567	10000.00	WM663737886622	2025-07-20 14:11:03.743344	2025-07-20 14:11:03.743344	txn-57e4f862-8a88-4d27-abb4-1b0dc20969f2
[{"price": "89.99", "quantity": 1, "productId": "67847a43-2c99-425f-b679-21c9bc734dec"}]	10089.99	DECLINED	test@example.com	Juan P├®rez	Calle 123 #45-67	Bogot├í	110111	573001234567	10000.00	WM160020601818	2025-07-20 14:19:20.024367	2025-07-20 14:19:20.024367	txn-1ad5c450-4f03-4f60-b12f-e71b896dadb3
[{"price": "89.99", "quantity": 1, "productId": "67847a43-2c99-425f-b679-21c9bc734dec"}]	10089.99	DECLINED	test@example.com	Juan P├®rez	Calle 123 #45-67	Bogot├í	110111	573001234567	10000.00	WM763319416952	2025-07-20 14:29:23.324776	2025-07-20 14:29:23.324776	txn-5e08d382-181d-480c-a59e-da91a518419c
[{"price": "89.99", "quantity": 1, "productId": "67847a43-2c99-425f-b679-21c9bc734dec"}]	10089.99	DECLINED	test@example.com	Juan P├®rez	Calle 123 #45-67	Bogot├í	110111	573001234567	10000.00	WM920616957558	2025-07-20 14:32:00.620048	2025-07-20 14:32:00.620048	txn-ea3a2f1c-7d8d-439c-a40b-0fb386d9b979
[{"price": "89.99", "quantity": 1, "productId": "67847a43-2c99-425f-b679-21c9bc734dec"}]	10089.99	DECLINED	test@example.com	Juan P├®rez	Calle 123 #45-67	Bogot├í	110111	573001234567	10000.00	WM992690141369	2025-07-20 14:49:52.696193	2025-07-20 14:49:52.696193	txn-54222476-b54c-47b8-96c3-24b3cfa56b9c
[{"price": "89.99", "quantity": 1, "productId": "67847a43-2c99-425f-b679-21c9bc734dec"}]	10089.99	DECLINED	test@example.com	Juan P├®rez	Calle 123 #45-67	Bogot├í	110111	573001234567	10000.00	WM755229338046	2025-07-20 15:02:35.235173	2025-07-20 15:02:35.235173	txn-2512db77-e1dc-43ae-9700-8585d4a9529d
[{"price": "89.99", "quantity": 1, "productId": "67847a43-2c99-425f-b679-21c9bc734dec"}]	10089.99	DECLINED	test@example.com	Juan P├®rez	Calle 123 #45-67	Bogot├í	110111	573001234567	10000.00	WM487487830123	2025-07-20 15:14:47.490504	2025-07-20 15:14:47.490504	txn-fbbdffe6-6e44-41a1-8248-a1cd2aa56acd
[{"price": "89.99", "quantity": 1, "productId": "67847a43-2c99-425f-b679-21c9bc734dec"}]	10089.99	DECLINED	test@example.com	Juan P├®rez	Calle 123 #45-67	Bogot├í	110111	573001234567	10000.00	WM557433719667	2025-07-20 15:15:57.43619	2025-07-20 15:15:57.43619	txn-bb455b17-0171-4660-b496-57a3e71d2707
[{"price": "89.99", "quantity": 1, "productId": "67847a43-2c99-425f-b679-21c9bc734dec"}]	10089.99	PENDING	test@example.com	Juan P├®rez	Calle 123 #45-67	Bogot├í	110111	573001234567	10000.00	WM183152280234	2025-07-20 18:29:43.158296	2025-07-20 18:29:43.158296	txn-a69dd608-ef80-456e-8e31-d35cc690a88a
[{"price": "89.99", "quantity": 1, "productId": "67847a43-2c99-425f-b679-21c9bc734dec"}]	10089.99	PENDING	test@example.com	Juan P├®rez	Calle 123 #45-67	Bogot├í	110111	573001234567	10000.00	WM969805992516	2025-07-20 19:32:49.805	2025-07-20 19:32:49.805	txn-952c7327-293a-4f91-b25e-d830cd21b15f
[{"price": "89.99", "quantity": 1, "productId": "67847a43-2c99-425f-b679-21c9bc734dec"}]	10089.99	DECLINED	test@example.com	Juan P├®rez	Calle 123 #45-67	Bogot├í	110111	573001234567	10000.00	WM030759550925	2025-07-20 19:50:30.759	2025-07-20 19:50:30.759	txn-d543dc85-0474-4ec4-9483-618b1503ee54
\.


--
-- Name: transactions PK_a219afd8dd77ed80f5a862f1db9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: products update_products_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- PostgreSQL database dump complete
--

