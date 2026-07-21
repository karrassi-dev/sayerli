--
-- PostgreSQL database dump
--

-- Dumped from database version 18.4 (Debian 18.4-1.pgdg13+1)
-- Dumped by pg_dump version 18.4 (Debian 18.4-1.pgdg13+1)

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
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- Name: MethodePaiement; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."MethodePaiement" AS ENUM (
    'CASH',
    'VIREMENT',
    'CARTE',
    'CHEQUE',
    'MOBILE',
    'AUTRE'
);


ALTER TYPE public."MethodePaiement" OWNER TO postgres;

--
-- Name: PlanType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PlanType" AS ENUM (
    'STARTER',
    'PRO',
    'BUSINESS'
);


ALTER TYPE public."PlanType" OWNER TO postgres;

--
-- Name: RoleType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."RoleType" AS ENUM (
    'ADMIN',
    'MANAGER',
    'COMMERCIAL',
    'COMPTABLE'
);


ALTER TYPE public."RoleType" OWNER TO postgres;

--
-- Name: StatutDeclaration; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."StatutDeclaration" AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED'
);


ALTER TYPE public."StatutDeclaration" OWNER TO postgres;

--
-- Name: StatutDevis; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."StatutDevis" AS ENUM (
    'BROUILLON',
    'ENVOYE',
    'VU',
    'ACCEPTE',
    'REFUSE'
);


ALTER TYPE public."StatutDevis" OWNER TO postgres;

--
-- Name: StatutFacture; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."StatutFacture" AS ENUM (
    'BROUILLON',
    'ENVOYEE',
    'PAYEE',
    'PARTIELLE',
    'EN_RETARD',
    'VUE',
    'ANNULEE'
);


ALTER TYPE public."StatutFacture" OWNER TO postgres;

--
-- Name: TypeNotification; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."TypeNotification" AS ENUM (
    'DEVIS_ENVOYE',
    'DEVIS_ACCEPTE',
    'DEVIS_REFUSE',
    'DEVIS_VU',
    'FACTURE_CREEE',
    'FACTURE_PAYEE',
    'FACTURE_PARTIELLE',
    'RAPPEL_ECHEANCE',
    'PAIEMENT_RECU',
    'FACTURE_ENVOYEE',
    'FACTURE_VUE',
    'DECLARATION_RECUE'
);


ALTER TYPE public."TypeNotification" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: clients; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clients (
    id text NOT NULL,
    "entrepriseId" text NOT NULL,
    nom text NOT NULL,
    email text,
    telephone text,
    "nomEntreprise" text,
    notes text,
    actif boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.clients OWNER TO postgres;

--
-- Name: contact_submissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contact_submissions (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    phone text,
    company text,
    subject text NOT NULL,
    message text NOT NULL,
    ip text,
    "userAgent" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.contact_submissions OWNER TO postgres;

--
-- Name: declarations_paiement; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.declarations_paiement (
    id text NOT NULL,
    "entrepriseId" text NOT NULL,
    "factureId" text NOT NULL,
    montant numeric(12,2) NOT NULL,
    methode public."MethodePaiement" DEFAULT 'VIREMENT'::public."MethodePaiement" NOT NULL,
    reference text,
    message text,
    "datePaiement" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    statut public."StatutDeclaration" DEFAULT 'PENDING'::public."StatutDeclaration" NOT NULL,
    "raisonRejet" text,
    "reviewedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.declarations_paiement OWNER TO postgres;

--
-- Name: devis; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.devis (
    id text NOT NULL,
    "entrepriseId" text NOT NULL,
    "clientId" text NOT NULL,
    reference text NOT NULL,
    statut public."StatutDevis" DEFAULT 'BROUILLON'::public."StatutDevis" NOT NULL,
    "totalHT" numeric(12,2) DEFAULT 0 NOT NULL,
    taxe numeric(5,2) DEFAULT 20 NOT NULL,
    "totalTTC" numeric(12,2) DEFAULT 0 NOT NULL,
    "dateExpiration" timestamp(3) without time zone,
    "dateAcceptation" timestamp(3) without time zone,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    remise numeric(12,2) DEFAULT 0 NOT NULL,
    "dateRefus" timestamp(3) without time zone,
    "dateEnvoi" timestamp(3) without time zone,
    "dateConsultation" timestamp(3) without time zone,
    "dateDerniereConsultation" timestamp(3) without time zone,
    "nombreConsultations" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.devis OWNER TO postgres;

--
-- Name: devis_lignes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.devis_lignes (
    id text NOT NULL,
    "devisId" text NOT NULL,
    description text NOT NULL,
    quantite numeric(10,3) DEFAULT 1 NOT NULL,
    "prixUnitaire" numeric(12,2) DEFAULT 0 NOT NULL,
    total numeric(12,2) DEFAULT 0 NOT NULL,
    ordre integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.devis_lignes OWNER TO postgres;

--
-- Name: entreprises; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.entreprises (
    id text NOT NULL,
    nom text NOT NULL,
    logo text,
    email text NOT NULL,
    telephone text,
    adresse text,
    devise text DEFAULT 'MAD'::text NOT NULL,
    plan public."PlanType" DEFAULT 'STARTER'::public."PlanType" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "couleurPrimaire" text DEFAULT '#2563eb'::text,
    "formatDate" text DEFAULT 'DD/MM/YYYY'::text,
    ice text,
    pays text DEFAULT 'Maroc'::text,
    "planExpiration" timestamp(3) without time zone,
    "planDebut" timestamp(3) without time zone,
    rc text,
    ville text,
    website text,
    "titulaireCompte" text,
    banque text,
    rib text,
    iban text,
    swift text
);


ALTER TABLE public.entreprises OWNER TO postgres;

--
-- Name: facture_lignes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.facture_lignes (
    id text NOT NULL,
    "factureId" text NOT NULL,
    description text NOT NULL,
    quantite numeric(10,3) DEFAULT 1 NOT NULL,
    "prixUnitaire" numeric(12,2) DEFAULT 0 NOT NULL,
    total numeric(12,2) DEFAULT 0 NOT NULL,
    ordre integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.facture_lignes OWNER TO postgres;

--
-- Name: factures; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.factures (
    id text NOT NULL,
    "entrepriseId" text NOT NULL,
    "clientId" text NOT NULL,
    "devisId" text,
    "numeroFacture" text NOT NULL,
    statut public."StatutFacture" DEFAULT 'BROUILLON'::public."StatutFacture" NOT NULL,
    "totalHT" numeric(12,2) DEFAULT 0 NOT NULL,
    taxe numeric(5,2) DEFAULT 20 NOT NULL,
    "totalTTC" numeric(12,2) DEFAULT 0 NOT NULL,
    "montantPaye" numeric(12,2) DEFAULT 0 NOT NULL,
    "dateEcheance" timestamp(3) without time zone,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "publicToken" text NOT NULL,
    "dateEnvoi" timestamp(3) without time zone,
    "dateConsultation" timestamp(3) without time zone,
    "dateDerniereConsultation" timestamp(3) without time zone,
    "nombreConsultations" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.factures OWNER TO postgres;

--
-- Name: liens_publics_devis; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.liens_publics_devis (
    id text NOT NULL,
    "devisId" text NOT NULL,
    token text NOT NULL,
    expiration timestamp(3) without time zone NOT NULL,
    utilise boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.liens_publics_devis OWNER TO postgres;

--
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id text NOT NULL,
    "entrepriseId" text NOT NULL,
    type public."TypeNotification" NOT NULL,
    message text NOT NULL,
    lu boolean DEFAULT false NOT NULL,
    lien text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- Name: paiements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.paiements (
    id text NOT NULL,
    "entrepriseId" text NOT NULL,
    "factureId" text NOT NULL,
    montant numeric(12,2) NOT NULL,
    methode public."MethodePaiement" DEFAULT 'VIREMENT'::public."MethodePaiement" NOT NULL,
    reference text,
    "datePaiement" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.paiements OWNER TO postgres;

--
-- Name: preferences_notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.preferences_notifications (
    id text NOT NULL,
    "utilisateurId" text NOT NULL,
    "emailNotifications" boolean DEFAULT true NOT NULL,
    "notificationsDevis" boolean DEFAULT true NOT NULL,
    "notificationsFactures" boolean DEFAULT true NOT NULL,
    "notificationsPaiements" boolean DEFAULT true NOT NULL,
    "notificationsSysteme" boolean DEFAULT true NOT NULL,
    "inAppDevis" boolean DEFAULT true NOT NULL,
    "inAppFactures" boolean DEFAULT true NOT NULL,
    "inAppPaiements" boolean DEFAULT true NOT NULL,
    "inAppSysteme" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.preferences_notifications OWNER TO postgres;

--
-- Name: utilisateurs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.utilisateurs (
    id text NOT NULL,
    "entrepriseId" text NOT NULL,
    nom text NOT NULL,
    email text NOT NULL,
    "motDePasseHash" text,
    role public."RoleType" DEFAULT 'COMMERCIAL'::public."RoleType" NOT NULL,
    actif boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    langue text DEFAULT 'fr'::text,
    telephone text,
    theme text DEFAULT 'system'::text,
    "dernierAcces" timestamp(3) without time zone,
    "invitationToken" text,
    "invitationTokenExpiration" timestamp(3) without time zone,
    prenom text
);


ALTER TABLE public.utilisateurs OWNER TO postgres;

--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
beac97a9-8d52-4918-925d-ccd6fabdd454	ae8f6ca2cdc73118a614e788902afe21e3bd545e1ac5c63e5724040dff56528a	2026-06-11 15:23:31.877891+00	20260609210000_add_inapp_notification_prefs	\N	\N	2026-06-11 15:23:31.877891+00	0
c656ab53-3b18-4e94-b79d-1125041405bb	a81193798006dd09b519594a5a2752ab3223ea46ce3a913f1d871e4821fc0fde	2026-06-11 15:23:39.127662+00	20260609220000_add_plan_debut	\N	\N	2026-06-11 15:23:39.127662+00	0
21042967-213d-416c-9c17-28da0eaae203	2abf12c245d7e05adbe344c8cfcf14aeb6755a90a1af2119cfddf7f57b074c63	2026-06-11 15:24:00.332225+00	20260610230000_add_contact_submissions	\N	\N	2026-06-11 15:24:00.332225+00	0
\.


--
-- Data for Name: clients; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.clients (id, "entrepriseId", nom, email, telephone, "nomEntreprise", notes, actif, "createdAt", "updatedAt") FROM stdin;
36678a88-6ada-49a6-bd8f-17fbbdf023b7	e39fcb60-6236-48c1-a7ad-512c9f05ae4a	tes client	Hello@gmail.com	212678657652	hamza lux	hello world	t	2026-06-11 15:27:49.66	2026-06-11 15:27:49.66
22ca9a4d-d59f-42d2-9baf-4f825d037f2a	0fc90ed6-112e-417a-8090-72dbfd5f8a68	tes client	client1@gmail.com	0687565272	clientpme	hello test client	t	2026-06-11 16:03:05.477	2026-06-11 16:03:05.477
\.


--
-- Data for Name: contact_submissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contact_submissions (id, name, email, phone, company, subject, message, ip, "userAgent", "createdAt") FROM stdin;
\.


--
-- Data for Name: declarations_paiement; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.declarations_paiement (id, "entrepriseId", "factureId", montant, methode, reference, message, "datePaiement", statut, "raisonRejet", "reviewedAt", "createdAt") FROM stdin;
90aaa65d-ce24-40a1-996e-829254490919	e39fcb60-6236-48c1-a7ad-512c9f05ae4a	d302d165-9293-4a52-bcd7-2df3915fd745	1800.00	VIREMENT	\N	\N	2026-06-11 00:00:00	APPROVED	\N	2026-06-11 15:31:03.552	2026-06-11 15:30:41.785
e71d2ed8-d1b1-42eb-9fa2-97c235d57b89	0fc90ed6-112e-417a-8090-72dbfd5f8a68	bd89e29e-0ac5-429c-b851-978610e23afe	920.00	CHEQUE	1234567890	bonjour cheque	2026-06-11 00:00:00	APPROVED	\N	2026-06-11 16:08:31.163	2026-06-11 16:07:14.76
d1002ec1-a24c-456d-be57-5764871c9050	e39fcb60-6236-48c1-a7ad-512c9f05ae4a	3ddd31c0-0eaa-4e0e-becb-9abae02e1b45	400.00	VIREMENT	\N	thanks	2026-06-11 00:00:00	APPROVED	\N	2026-06-11 16:41:42.087	2026-06-11 16:40:52.538
8fd726c0-1c2e-4a93-acc5-c0caf081ead2	0fc90ed6-112e-417a-8090-72dbfd5f8a68	bd89e29e-0ac5-429c-b851-978610e23afe	500.00	VIREMENT	\N	\N	2026-06-11 00:00:00	APPROVED	\N	2026-06-11 19:48:35.555	2026-06-11 19:48:13.462
\.


--
-- Data for Name: devis; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.devis (id, "entrepriseId", "clientId", reference, statut, "totalHT", taxe, "totalTTC", "dateExpiration", "dateAcceptation", notes, "createdAt", "updatedAt", remise, "dateRefus", "dateEnvoi", "dateConsultation", "dateDerniereConsultation", "nombreConsultations") FROM stdin;
e04fbe64-8786-4be3-a545-b5cd41d913b9	e39fcb60-6236-48c1-a7ad-512c9f05ae4a	36678a88-6ada-49a6-bd8f-17fbbdf023b7	DEV-2026-0001	ACCEPTE	4000.00	20.00	4800.00	2026-06-12 00:00:00	2026-06-11 15:29:30.926	\N	2026-06-11 15:28:13.181	2026-06-11 15:29:30.927	0.00	\N	2026-06-11 15:28:17.793	2026-06-11 15:29:16.956	2026-06-11 15:29:16.956	1
63ffba15-8753-44a3-b468-2d0b379f6c53	0fc90ed6-112e-417a-8090-72dbfd5f8a68	22ca9a4d-d59f-42d2-9baf-4f825d037f2a	DEV-2026-0001	ACCEPTE	1600.00	20.00	1920.00	2026-06-13 00:00:00	2026-06-11 16:04:15.6	heklsdshdsqhdkhsqkdqsd	2026-06-11 16:03:56.575	2026-06-11 16:04:15.601	0.00	\N	2026-06-11 16:04:00.252	2026-06-11 16:04:08.115	2026-06-11 16:04:08.115	1
39ba9569-5ef2-411c-b878-b584e9eece3a	e39fcb60-6236-48c1-a7ad-512c9f05ae4a	36678a88-6ada-49a6-bd8f-17fbbdf023b7	DEV-2026-0002	ACCEPTE	2000.00	20.00	2400.00	2026-06-19 00:00:00	2026-06-11 16:39:45.718	\N	2026-06-11 16:39:26.657	2026-06-11 16:39:45.718	0.00	\N	2026-06-11 16:39:29.715	2026-06-11 16:39:37.723	2026-06-11 16:39:37.723	1
\.


--
-- Data for Name: devis_lignes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.devis_lignes (id, "devisId", description, quantite, "prixUnitaire", total, ordre) FROM stdin;
59e081aa-42c9-4d80-8ae1-862e1319b5d1	e04fbe64-8786-4be3-a545-b5cd41d913b9	test	20.000	200.00	4000.00	0
e86ff410-d7cf-4696-8759-964b6bae2617	63ffba15-8753-44a3-b468-2d0b379f6c53	tesg	8.000	200.00	1600.00	0
aa5c557c-dd9a-43eb-819f-c67d44a39e1f	39ba9569-5ef2-411c-b878-b584e9eece3a	sqkjdhkjqhsgdk	1.000	2000.00	2000.00	0
\.


--
-- Data for Name: entreprises; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.entreprises (id, nom, logo, email, telephone, adresse, devise, plan, "createdAt", "updatedAt", "couleurPrimaire", "formatDate", ice, pays, "planExpiration", "planDebut", rc, ville, website, "titulaireCompte", banque, rib, iban, swift) FROM stdin;
5ec10434-0e3c-42b9-890f-02a578734257	Test SARL	\N	test@sayerli.ma	\N	\N	MAD	STARTER	2026-06-11 15:25:37.408	2026-06-11 15:25:37.408	#2563eb	DD/MM/YYYY	\N	Maroc	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2b850a94-c023-481f-bf1e-77b6fc874834	Test	\N	t2@t.ma	\N	\N	MAD	STARTER	2026-06-11 15:59:26.872	2026-06-11 15:59:26.872	#2563eb	DD/MM/YYYY	\N	Maroc	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
0fc90ed6-112e-417a-8090-72dbfd5f8a68	hamzaLTD	/uploads/logos/logo-0fc90ed6-112e-417a-8090-72dbfd5f8a68-1781193813169.png	hello@gmail.com	0605675431	\N	MAD	PRO	2026-06-11 16:02:07.798	2026-06-11 16:03:35.167	#ea580c	DD/MM/YYYY	\N	Maroc	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
e39fcb60-6236-48c1-a7ad-512c9f05ae4a	hamzaltd	/uploads/logos/logo-e39fcb60-6236-48c1-a7ad-512c9f05ae4a-1781195949957.png	Hello@gmail.com	0605765272	\N	MAD	BUSINESS	2026-06-11 15:26:40.471	2026-06-11 16:39:12.054	#059669	DD/MM/YYYY	\N	Maroc	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
\.


--
-- Data for Name: facture_lignes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.facture_lignes (id, "factureId", description, quantite, "prixUnitaire", total, ordre) FROM stdin;
5983259f-9d39-401b-9fd7-fabc97a209a5	d302d165-9293-4a52-bcd7-2df3915fd745	test	20.000	200.00	4000.00	0
f83b927f-a932-48a3-ae02-6c12224d7193	bd89e29e-0ac5-429c-b851-978610e23afe	tesg	8.000	200.00	1600.00	0
4178be60-d3de-42e6-ad57-c574ff67e625	3ddd31c0-0eaa-4e0e-becb-9abae02e1b45	sqkjdhkjqhsgdk	1.000	2000.00	2000.00	0
\.


--
-- Data for Name: factures; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.factures (id, "entrepriseId", "clientId", "devisId", "numeroFacture", statut, "totalHT", taxe, "totalTTC", "montantPaye", "dateEcheance", notes, "createdAt", "updatedAt", "publicToken", "dateEnvoi", "dateConsultation", "dateDerniereConsultation", "nombreConsultations") FROM stdin;
d302d165-9293-4a52-bcd7-2df3915fd745	e39fcb60-6236-48c1-a7ad-512c9f05ae4a	36678a88-6ada-49a6-bd8f-17fbbdf023b7	e04fbe64-8786-4be3-a545-b5cd41d913b9	FAC-2026-0001	PARTIELLE	4000.00	20.00	4800.00	1800.00	\N	\N	2026-06-11 15:30:15.856	2026-06-11 15:31:03.553	5f0cc92c-1434-42f5-88a6-faba586a8d98	2026-06-11 15:30:22.871	2026-06-11 15:30:26.64	2026-06-11 15:30:26.64	1
3ddd31c0-0eaa-4e0e-becb-9abae02e1b45	e39fcb60-6236-48c1-a7ad-512c9f05ae4a	36678a88-6ada-49a6-bd8f-17fbbdf023b7	39ba9569-5ef2-411c-b878-b584e9eece3a	FAC-2026-0002	PARTIELLE	2000.00	20.00	2400.00	400.00	\N	\N	2026-06-11 16:40:24.603	2026-06-11 16:41:42.088	cad8ee83-455d-423f-a201-41b922bcf50a	2026-06-11 16:40:33.486	2026-06-11 16:40:37.06	2026-06-11 16:40:37.06	1
bd89e29e-0ac5-429c-b851-978610e23afe	0fc90ed6-112e-417a-8090-72dbfd5f8a68	22ca9a4d-d59f-42d2-9baf-4f825d037f2a	63ffba15-8753-44a3-b468-2d0b379f6c53	FAC-2026-0001	PARTIELLE	1600.00	20.00	1920.00	1420.00	\N	\N	2026-06-11 16:06:25.3	2026-06-11 19:48:35.555	9546ee27-6bf1-4540-becb-a6ecadbddc5c	2026-06-11 16:06:30.145	2026-06-11 16:06:37.039	2026-06-11 19:47:59.912	3
\.


--
-- Data for Name: liens_publics_devis; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.liens_publics_devis (id, "devisId", token, expiration, utilise, "createdAt") FROM stdin;
055a3d9c-87c7-4b79-abe8-f32b61b37c38	e04fbe64-8786-4be3-a545-b5cd41d913b9	beeda457-606a-410c-ad93-7aa9d1bc701f	2026-07-11 15:28:37.911	t	2026-06-11 15:28:18.182
4b81e241-d2c0-4707-8870-470ca0ecf911	63ffba15-8753-44a3-b468-2d0b379f6c53	55186eff-2f3f-4ed8-87cf-4ea7b7cda383	2026-07-11 16:04:00.643	t	2026-06-11 16:04:00.644
7df5b28e-5fd5-4544-9a3d-ff035a46486c	39ba9569-5ef2-411c-b878-b584e9eece3a	740d3f5d-e276-4f6a-ac6f-98897f76dba1	2026-07-11 16:39:30.098	t	2026-06-11 16:39:30.099
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, "entrepriseId", type, message, lu, lien, "createdAt") FROM stdin;
037749f0-0254-45fc-b8ec-8867903be8bd	e39fcb60-6236-48c1-a7ad-512c9f05ae4a	DEVIS_ENVOYE	Le devis DEV-2026-0001 est maintenant envoye.	t	/devis/e04fbe64-8786-4be3-a545-b5cd41d913b9	2026-06-11 15:28:17.794
210a8305-e42e-463e-b24f-5dfcfc11a3d4	e39fcb60-6236-48c1-a7ad-512c9f05ae4a	DEVIS_ACCEPTE	Le devis DEV-2026-0001 a été accepté par le client.	t	/dashboard/devis	2026-06-11 15:29:30.927
2e4e3636-607d-4b7f-8bd9-69d7a7f9d014	e39fcb60-6236-48c1-a7ad-512c9f05ae4a	DECLARATION_RECUE	Nouvelle déclaration de paiement reçue pour la facture FAC-2026-0001 — 1800 MAD.	t	/dashboard/declarations	2026-06-11 15:30:41.785
bf5b6522-47b2-4cf9-b5bd-27b8821f3a66	e39fcb60-6236-48c1-a7ad-512c9f05ae4a	FACTURE_VUE	La facture FAC-2026-0001 a été consultée par tes client.	t	/dashboard/factures	2026-06-11 15:30:26.641
2232f78c-91b9-42a6-9807-fc3669a1a2d7	e39fcb60-6236-48c1-a7ad-512c9f05ae4a	FACTURE_ENVOYEE	La facture FAC-2026-0001 a été envoyée au client.	t	/dashboard/factures	2026-06-11 15:30:22.872
805c2247-f190-4363-8dab-02a6b3fec0ef	e39fcb60-6236-48c1-a7ad-512c9f05ae4a	FACTURE_PARTIELLE	Déclaration approuvée : 1800 MAD reçus pour la facture FAC-2026-0001.	t	/dashboard/factures	2026-06-11 15:31:03.553
4e9cf6e6-4c28-45fc-a0aa-04d4a539be1a	0fc90ed6-112e-417a-8090-72dbfd5f8a68	DEVIS_ENVOYE	Le devis DEV-2026-0001 est maintenant envoye.	t	/devis/63ffba15-8753-44a3-b468-2d0b379f6c53	2026-06-11 16:04:00.254
4584e835-cd7d-49cc-a659-c57804df63ac	0fc90ed6-112e-417a-8090-72dbfd5f8a68	DEVIS_ACCEPTE	Le devis DEV-2026-0001 a été accepté par le client.	t	/dashboard/devis	2026-06-11 16:04:15.601
db84f841-ec9c-4415-8f4f-ef628694a936	0fc90ed6-112e-417a-8090-72dbfd5f8a68	FACTURE_ENVOYEE	La facture FAC-2026-0001 a été envoyée au client.	t	/dashboard/factures	2026-06-11 16:06:30.146
98191952-2192-4b3e-8a7c-0d7e77f24873	0fc90ed6-112e-417a-8090-72dbfd5f8a68	FACTURE_VUE	La facture FAC-2026-0001 a été consultée par tes client.	t	/dashboard/factures	2026-06-11 16:06:37.04
b1cf692e-2b65-4e0e-81e4-193845605b81	0fc90ed6-112e-417a-8090-72dbfd5f8a68	DECLARATION_RECUE	Nouvelle déclaration de paiement reçue pour la facture FAC-2026-0001 — 920 MAD.	t	/dashboard/declarations	2026-06-11 16:07:14.76
ac2875d2-fee5-4be3-a742-4d4ce0f9b96b	0fc90ed6-112e-417a-8090-72dbfd5f8a68	FACTURE_PARTIELLE	Déclaration approuvée : 920 MAD reçus pour la facture FAC-2026-0001.	t	/dashboard/factures	2026-06-11 16:08:31.163
72c23ea8-5976-4367-a38a-e0b8133cdad3	e39fcb60-6236-48c1-a7ad-512c9f05ae4a	DEVIS_ACCEPTE	Le devis DEV-2026-0002 a été accepté par le client.	t	/dashboard/devis	2026-06-11 16:39:45.718
f33079b9-85c8-4711-8d86-f60e16daa134	e39fcb60-6236-48c1-a7ad-512c9f05ae4a	DEVIS_ENVOYE	Le devis DEV-2026-0002 est maintenant envoye.	t	/devis/39ba9569-5ef2-411c-b878-b584e9eece3a	2026-06-11 16:39:29.716
74555960-bf52-4724-81e1-4a797a1c189b	e39fcb60-6236-48c1-a7ad-512c9f05ae4a	FACTURE_VUE	La facture FAC-2026-0002 a été consultée par tes client.	t	/dashboard/factures	2026-06-11 16:40:37.061
a7e322fa-7e44-412b-9131-457164eaa9a6	e39fcb60-6236-48c1-a7ad-512c9f05ae4a	FACTURE_ENVOYEE	La facture FAC-2026-0002 a été envoyée au client.	t	/dashboard/factures	2026-06-11 16:40:33.487
af42d3fd-6f39-46df-84c0-bb44aa05376c	e39fcb60-6236-48c1-a7ad-512c9f05ae4a	DECLARATION_RECUE	Nouvelle déclaration de paiement reçue pour la facture FAC-2026-0002 — 400 MAD.	t	/dashboard/declarations	2026-06-11 16:40:52.538
281de9fa-e696-41aa-a3ac-1b0f51c2eed5	e39fcb60-6236-48c1-a7ad-512c9f05ae4a	FACTURE_PARTIELLE	Déclaration approuvée : 400 MAD reçus pour la facture FAC-2026-0002.	t	/dashboard/factures	2026-06-11 16:41:42.088
f18652b5-d99d-4a26-8640-1439e3bdd93d	0fc90ed6-112e-417a-8090-72dbfd5f8a68	DECLARATION_RECUE	Nouvelle déclaration de paiement reçue pour la facture FAC-2026-0001 — 500 MAD.	t	/dashboard/declarations	2026-06-11 19:48:13.462
e28d2512-a6ce-435b-8d9e-33e746fe8442	0fc90ed6-112e-417a-8090-72dbfd5f8a68	FACTURE_PARTIELLE	Déclaration approuvée : 500 MAD reçus pour la facture FAC-2026-0001.	t	/dashboard/factures	2026-06-11 19:48:35.555
\.


--
-- Data for Name: paiements; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.paiements (id, "entrepriseId", "factureId", montant, methode, reference, "datePaiement", notes, "createdAt") FROM stdin;
b279317a-8b25-4209-b07d-11cc06f094ff	e39fcb60-6236-48c1-a7ad-512c9f05ae4a	d302d165-9293-4a52-bcd7-2df3915fd745	1800.00	VIREMENT	\N	2026-06-11 00:00:00	\N	2026-06-11 15:31:03.553
16b48600-dc7c-4066-9ab7-5cdfccc19f43	0fc90ed6-112e-417a-8090-72dbfd5f8a68	bd89e29e-0ac5-429c-b851-978610e23afe	920.00	CHEQUE	1234567890	2026-06-11 00:00:00	bonjour cheque	2026-06-11 16:08:31.163
4ae3749f-a787-4dd3-91d5-a3535eb5b88e	e39fcb60-6236-48c1-a7ad-512c9f05ae4a	3ddd31c0-0eaa-4e0e-becb-9abae02e1b45	400.00	VIREMENT	\N	2026-06-11 00:00:00	thanks	2026-06-11 16:41:42.088
fafaa654-56c7-438b-a4cf-a0706b5135e8	0fc90ed6-112e-417a-8090-72dbfd5f8a68	bd89e29e-0ac5-429c-b851-978610e23afe	500.00	VIREMENT	\N	2026-06-11 00:00:00	\N	2026-06-11 19:48:35.555
\.


--
-- Data for Name: preferences_notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.preferences_notifications (id, "utilisateurId", "emailNotifications", "notificationsDevis", "notificationsFactures", "notificationsPaiements", "notificationsSysteme", "inAppDevis", "inAppFactures", "inAppPaiements", "inAppSysteme", "createdAt", "updatedAt") FROM stdin;
049c7bc8-1163-4c54-8f43-150c691a4332	0240b8ba-533e-451b-9db8-bcd4cd70914f	t	t	t	t	t	t	t	t	t	2026-06-11 15:26:43.006	2026-06-11 15:26:43.006
e041cfc0-00a7-419a-99c4-e4348df51dd3	c191f1bd-1639-4596-945e-b4dfb1c371e6	t	t	t	t	t	t	t	t	t	2026-06-11 16:02:09.453	2026-06-11 16:02:09.453
5b41c54a-313d-4fe0-8138-a9c2b7e87d40	b62ec21a-4d51-431e-8683-43ce6c32ac08	t	t	t	t	t	t	t	t	t	2026-06-11 16:37:44.238	2026-06-11 16:37:44.238
\.


--
-- Data for Name: utilisateurs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.utilisateurs (id, "entrepriseId", nom, email, "motDePasseHash", role, actif, "createdAt", "updatedAt", langue, telephone, theme, "dernierAcces", "invitationToken", "invitationTokenExpiration", prenom) FROM stdin;
f7157a7b-ff16-4425-b38d-2ea1a9f85baa	5ec10434-0e3c-42b9-890f-02a578734257	Mohammed	mohammed@sayerli.ma	$2b$12$xRXrq9/OOkwwb.dUXFu.fOARYiQqHjL/qqNul8C1AC07SjKzMXnH.	ADMIN	t	2026-06-11 15:25:37.408	2026-06-11 15:25:37.408	fr	\N	system	\N	\N	\N	\N
0bdf34b6-a7e8-4b4e-aca1-96468d0c71ec	2b850a94-c023-481f-bf1e-77b6fc874834	Test	a2@t.ma	$2b$12$y2..EBUsZsMeAPgk6HJn5.v3mwqlyrZV3HJM5tAweKb506h87u8tG	ADMIN	t	2026-06-11 15:59:26.872	2026-06-11 15:59:26.872	fr	\N	system	\N	\N	\N	\N
b62ec21a-4d51-431e-8683-43ce6c32ac08	e39fcb60-6236-48c1-a7ad-512c9f05ae4a	lux	hlux1986@gmail.com	$2b$12$RoFMZk0KGWGN7vhWVHuQ7eFQ5QSHcTRtQm6UFvg1OxF6L2YZoYe/a	COMMERCIAL	t	2026-06-11 16:36:23.69	2026-06-11 16:37:42.964	fr	+212603014298	system	2026-06-11 16:37:42.964	\N	\N	luca
c191f1bd-1639-4596-945e-b4dfb1c371e6	0fc90ed6-112e-417a-8090-72dbfd5f8a68	hamza ltd	hello@gmail.com	$2b$12$IxnU7zsjzM5I/gKOLfmj7eEdb.bGffKKl/F2StfaU5D07os.jbgM6	ADMIN	t	2026-06-11 16:02:07.798	2026-06-11 19:18:26.335	fr	\N	dark	2026-06-11 19:18:26.333	\N	\N	\N
0240b8ba-533e-451b-9db8-bcd4cd70914f	e39fcb60-6236-48c1-a7ad-512c9f05ae4a	hamza test	Hello@gmail.com	$2b$12$I0iVvYX6q8plv9eVQ85wwO5WY7Rk1pbwBEKMmsBjLmPkf1kP9LYrO	ADMIN	t	2026-06-11 15:26:40.471	2026-06-12 10:34:15.513	fr	\N	dark	2026-06-12 10:34:15.512	\N	\N	\N
\.


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: clients clients_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_pkey PRIMARY KEY (id);


--
-- Name: contact_submissions contact_submissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_submissions
    ADD CONSTRAINT contact_submissions_pkey PRIMARY KEY (id);


--
-- Name: declarations_paiement declarations_paiement_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.declarations_paiement
    ADD CONSTRAINT declarations_paiement_pkey PRIMARY KEY (id);


--
-- Name: devis_lignes devis_lignes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.devis_lignes
    ADD CONSTRAINT devis_lignes_pkey PRIMARY KEY (id);


--
-- Name: devis devis_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.devis
    ADD CONSTRAINT devis_pkey PRIMARY KEY (id);


--
-- Name: entreprises entreprises_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.entreprises
    ADD CONSTRAINT entreprises_pkey PRIMARY KEY (id);


--
-- Name: facture_lignes facture_lignes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.facture_lignes
    ADD CONSTRAINT facture_lignes_pkey PRIMARY KEY (id);


--
-- Name: factures factures_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.factures
    ADD CONSTRAINT factures_pkey PRIMARY KEY (id);


--
-- Name: liens_publics_devis liens_publics_devis_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.liens_publics_devis
    ADD CONSTRAINT liens_publics_devis_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: paiements paiements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paiements
    ADD CONSTRAINT paiements_pkey PRIMARY KEY (id);


--
-- Name: preferences_notifications preferences_notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.preferences_notifications
    ADD CONSTRAINT preferences_notifications_pkey PRIMARY KEY (id);


--
-- Name: utilisateurs utilisateurs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateurs
    ADD CONSTRAINT utilisateurs_pkey PRIMARY KEY (id);


--
-- Name: clients_entrepriseId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "clients_entrepriseId_idx" ON public.clients USING btree ("entrepriseId");


--
-- Name: contact_submissions_email_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX contact_submissions_email_idx ON public.contact_submissions USING btree (email);


--
-- Name: declarations_paiement_entrepriseId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "declarations_paiement_entrepriseId_idx" ON public.declarations_paiement USING btree ("entrepriseId");


--
-- Name: declarations_paiement_factureId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "declarations_paiement_factureId_idx" ON public.declarations_paiement USING btree ("factureId");


--
-- Name: devis_clientId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "devis_clientId_idx" ON public.devis USING btree ("clientId");


--
-- Name: devis_entrepriseId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "devis_entrepriseId_idx" ON public.devis USING btree ("entrepriseId");


--
-- Name: entreprises_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX entreprises_email_key ON public.entreprises USING btree (email);


--
-- Name: factures_clientId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "factures_clientId_idx" ON public.factures USING btree ("clientId");


--
-- Name: factures_entrepriseId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "factures_entrepriseId_idx" ON public.factures USING btree ("entrepriseId");


--
-- Name: factures_entrepriseId_numeroFacture_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "factures_entrepriseId_numeroFacture_key" ON public.factures USING btree ("entrepriseId", "numeroFacture");


--
-- Name: factures_publicToken_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "factures_publicToken_key" ON public.factures USING btree ("publicToken");


--
-- Name: liens_publics_devis_devisId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "liens_publics_devis_devisId_key" ON public.liens_publics_devis USING btree ("devisId");


--
-- Name: liens_publics_devis_token_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX liens_publics_devis_token_key ON public.liens_publics_devis USING btree (token);


--
-- Name: notifications_entrepriseId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "notifications_entrepriseId_idx" ON public.notifications USING btree ("entrepriseId");


--
-- Name: notifications_lu_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX notifications_lu_idx ON public.notifications USING btree (lu);


--
-- Name: paiements_entrepriseId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "paiements_entrepriseId_idx" ON public.paiements USING btree ("entrepriseId");


--
-- Name: paiements_factureId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "paiements_factureId_idx" ON public.paiements USING btree ("factureId");


--
-- Name: preferences_notifications_utilisateurId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "preferences_notifications_utilisateurId_key" ON public.preferences_notifications USING btree ("utilisateurId");


--
-- Name: utilisateurs_entrepriseId_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "utilisateurs_entrepriseId_email_key" ON public.utilisateurs USING btree ("entrepriseId", email);


--
-- Name: utilisateurs_invitationToken_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "utilisateurs_invitationToken_key" ON public.utilisateurs USING btree ("invitationToken");


--
-- Name: clients clients_entrepriseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT "clients_entrepriseId_fkey" FOREIGN KEY ("entrepriseId") REFERENCES public.entreprises(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: declarations_paiement declarations_paiement_entrepriseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.declarations_paiement
    ADD CONSTRAINT "declarations_paiement_entrepriseId_fkey" FOREIGN KEY ("entrepriseId") REFERENCES public.entreprises(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: declarations_paiement declarations_paiement_factureId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.declarations_paiement
    ADD CONSTRAINT "declarations_paiement_factureId_fkey" FOREIGN KEY ("factureId") REFERENCES public.factures(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: devis devis_clientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.devis
    ADD CONSTRAINT "devis_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES public.clients(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: devis devis_entrepriseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.devis
    ADD CONSTRAINT "devis_entrepriseId_fkey" FOREIGN KEY ("entrepriseId") REFERENCES public.entreprises(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: devis_lignes devis_lignes_devisId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.devis_lignes
    ADD CONSTRAINT "devis_lignes_devisId_fkey" FOREIGN KEY ("devisId") REFERENCES public.devis(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: facture_lignes facture_lignes_factureId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.facture_lignes
    ADD CONSTRAINT "facture_lignes_factureId_fkey" FOREIGN KEY ("factureId") REFERENCES public.factures(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: factures factures_clientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.factures
    ADD CONSTRAINT "factures_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES public.clients(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: factures factures_devisId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.factures
    ADD CONSTRAINT "factures_devisId_fkey" FOREIGN KEY ("devisId") REFERENCES public.devis(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: factures factures_entrepriseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.factures
    ADD CONSTRAINT "factures_entrepriseId_fkey" FOREIGN KEY ("entrepriseId") REFERENCES public.entreprises(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: liens_publics_devis liens_publics_devis_devisId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.liens_publics_devis
    ADD CONSTRAINT "liens_publics_devis_devisId_fkey" FOREIGN KEY ("devisId") REFERENCES public.devis(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: notifications notifications_entrepriseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT "notifications_entrepriseId_fkey" FOREIGN KEY ("entrepriseId") REFERENCES public.entreprises(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: paiements paiements_entrepriseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paiements
    ADD CONSTRAINT "paiements_entrepriseId_fkey" FOREIGN KEY ("entrepriseId") REFERENCES public.entreprises(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: paiements paiements_factureId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paiements
    ADD CONSTRAINT "paiements_factureId_fkey" FOREIGN KEY ("factureId") REFERENCES public.factures(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: preferences_notifications preferences_notifications_utilisateurId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.preferences_notifications
    ADD CONSTRAINT "preferences_notifications_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES public.utilisateurs(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: utilisateurs utilisateurs_entrepriseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateurs
    ADD CONSTRAINT "utilisateurs_entrepriseId_fkey" FOREIGN KEY ("entrepriseId") REFERENCES public.entreprises(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--
