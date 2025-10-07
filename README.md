# sis257_tienda_textiles
Proyecto final sis257
Sansa Designs es un emprendimiento localizado en Sucre – Bolivia, dedicado a la venta de productos textiles artesanales como carteras, billeteras, bolsos y cojines, elaborados principalmente con materiales naturales como lino, lana y yute.
La empresa funciona únicamente de manera virtual, utilizando redes sociales (Facebook, Instagram, TikTok) y una página web para difundir y vender sus productos. Nació en 2020 durante la pandemia y se consolidó en 2021, destacándose por la originalidad de sus diseños, la identidad cultural y la estética contemporánea.
Actualmente, enfrenta limitaciones en la gestión de proveedores, inventarios, ventas y reportes, ya que todos sus procesos se realizan de forma manual y dispersa. El objetivo del proyecto es desarrollar un sistema informático de gestión que permita automatizar y optimizar estos procesos, mejorando la eficiencia administrativa y la toma de decisiones.
Campos tentativos:
Usuarios: Almacena los datos de clientes y administradores, diferenciados por roles y credenciales de acceso.
Categorías: Define la clasificación de los productos (ejemplo: carteras, bolsos, cojines).
Productos: Contiene la información de los artículos disponibles en la tienda, su precio, stock y categoría.
Proveedores: Registra los datos de los proveedores y los materiales que suministran a la empresa.
Inventario: Controla las existencias de insumos y productos terminados, vinculados a proveedores.
Carrito: Representa la selección temporal de productos que un usuario añade antes de realizar un pedido.
carrito_productos: Tabla pivote que guarda los productos y cantidades asociados a un carrito.
Pedidos: Registra las compras confirmadas realizadas por los usuarios, con su estado y total.
pedido_productos: Tabla pivote que guarda los productos y cantidades asociados a un pedido específico.
Pagos: Almacena la información de las transacciones de un pedido, incluyendo método, monto y estado.
Reportes: Contiene indicadores generados automáticamente sobre ventas, inventario o proveedores.
Usuarios (id, nombre, apellidos, email, password, rol, fecha_creacion)
categorías (id, nombre, descripcion)
productos (id, nombre, descripcion, precio, stock, id_categoria, imagen_url)
proveedores (id, nombre, telefono, email, direccion, materiales)
inventario (id, nombre_item, tipo, cantidad, unidad_medida, id_proveedor)
carrito (id, id_usuario, creado_en, estado)
carrito_productos (id, id_carrito, id_producto, cantidad)
pedidos (id, id_usuario, total, estado, fecha_creacion)
pedido_productos (id, id_pedido, id_producto, cantidad, precio_unitario)
pagos (id, id_pedido, metodo, monto, estado, fecha_pago)
reportes (id, tipo, fecha_generacion, datos)
