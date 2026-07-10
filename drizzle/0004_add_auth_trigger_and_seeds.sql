CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.usuarios (id, nombre, apellido, n_dni, email, id_rol, solicitud_vendedor)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'nombre',
    new.raw_user_meta_data->>'apellido',
    new.raw_user_meta_data->>'nDni',
    new.email,
    3,
    COALESCE((new.raw_user_meta_data->>'solicitudVendedor')::boolean, false)
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

INSERT INTO "roles" ("id", "rol") VALUES
(1, 'Admin'),
(2, 'Vendedor'),
(3, 'Cliente')
ON CONFLICT ("id") DO NOTHING;

SELECT setval('roles_id_seq', COALESCE((SELECT MAX(id) FROM roles), 1));

INSERT INTO "estados" ("id", "estado") VALUES
(1, 'Disponible'),
(2, 'No disponible'),
(3, 'Vendido')
ON CONFLICT ("id") DO NOTHING;

SELECT setval('estados_id_seq', COALESCE((SELECT MAX(id) FROM estados), 1));

INSERT INTO "metodos_pago" ("id", "metodo") VALUES
(1, 'Efectivo'),
(2, 'Transferencia'),
(3, 'Tarjeta')
ON CONFLICT ("id") DO NOTHING;

SELECT setval('metodos_pago_id_seq', COALESCE((SELECT MAX(id) FROM metodos_pago), 1));