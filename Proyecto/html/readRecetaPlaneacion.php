<?php
include('../php/connect.php');

if (isset($_POST["idReceta"])) {
	$idReceta = $_POST["idReceta"];
	//echo "El ID de la receta es: " . $idReceta;
  } else {
	echo "No se recibió el ID de la receta.";
  }

// Realizar la consultas
$resultadonombre = mysqli_query($conex, "SELECT nombre FROM recetas WHERE idRecetas = $idReceta");
$resultadoduracion = mysqli_query($conex, "SELECT duracion FROM recetas WHERE idRecetas = $idReceta");
$resultadoporcion = mysqli_query($conex, "SELECT no_porciones FROM recetas_has_planeacion WHERE recetas_idRecetas = $idReceta");
$resultadoporcion2 = mysqli_query($conex, "SELECT porciones FROM recetas WHERE idRecetas = $idReceta");
$resultadoingrediente = mysqli_query($conex, "SELECT * FROM ingredientes INNER JOIN recetas_has_ingredientes ON recetas_has_ingredientes.Ingredientes_idIngredientes= ingredientes.idIngredientes WHERE recetas_has_ingredientes.Recetas_idRecetas=$idReceta");
$resultadopasos = mysqli_query($conex, "SELECT paso, nopaso FROM pasos WHERE Recetas_idRecetas=$idReceta ORDER BY nopaso ASC");
$resultadocantidad = mysqli_query($conex, "SELECT cantidad FROM recetas_has_ingredientes WHERE Recetas_idRecetas = $idReceta");
$resultadounidad = mysqli_query($conex, "SELECT unidad_medida FROM recetas_has_ingredientes WHERE Recetas_idRecetas = $idReceta");

//IMAGEN
$qimagen = "SELECT imagen FROM recetas WHERE idRecetas = $idReceta";
$resultadoimagen = $conex->query($qimagen);
$imagen = mysqli_fetch_assoc($resultadoimagen)["imagen"];
$imagen_base64 = base64_encode($imagen);

//Imágenes pasos 
$resultadoimgpasos = mysqli_query($conex, "SELECT imagen FROM pasos WHERE Recetas_idRecetas= $idReceta");

// Obtener el valor de la columna y guardarlo en una variable
$nombre = mysqli_fetch_assoc($resultadonombre)["nombre"];
$duracion = mysqli_fetch_assoc($resultadoduracion)["duracion"];
$porciones = mysqli_fetch_assoc($resultadoporcion)["no_porciones"];
$porciones2 = mysqli_fetch_assoc($resultadoporcion2)["porciones"];
$equiv= $porciones/$porciones2;

$ingredientes = mysqli_fetch_assoc($resultadoingrediente)["nombre"];
$cantidad= mysqli_fetch_assoc($resultadocantidad)["cantidad"];
$unidad= mysqli_fetch_assoc($resultadounidad)["unidad_medida"];
$pasos = mysqli_fetch_assoc($resultadopasos)["paso"];

// Cerrar la conexión a la base de datos
mysqli_close($conex);
?>

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <!-- Meta, title, CSS, favicons, etc. -->
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>C & C</title>

    <!-- Bootstrap -->
    <link href="../../gentelella-master/vendors/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link href="../../gentelella-master/vendors/font-awesome/css/font-awesome.min.css" rel="stylesheet">
    <!-- NProgress -->
    <link href="../../gentelella-master/vendors/nprogress/nprogress.css" rel="stylesheet">

    <!-- Custom Theme Style -->
    <link href="../../gentelella-master/build/css/custom.min.css" rel="stylesheet">
  </head>

  <body class="nav-md">
    <div class="container body">
      <div class="main_container">
        <div class="col-md-3 left_col">
			<div class="left_col scroll-view">
				<div class="navbar nav_title" style="border: 0;">
					<a href="index.html" class="site_title"><i class="fa fa-paw"></i> <span>C & C</span></a>
				</div>

				<div class="clearfix"></div>

				<!-- menu profile quick info -->
				<div class="profile clearfix">
					<div class="profile_pic">
						<img src="../../gentelella-master/production/images/img.jpg" alt="..." class="img-circle profile_img">
					</div>
					<div class="profile_info">
						<span>Bienvenido</span>
						<h2>Nombre de usuario</h2>
					</div>
				</div>
				<!-- /menu profile quick info -->

				<br />

				<!-- sidebar menu -->
				<div id="sidebar-menu" class="main_menu_side hidden-print main_menu">
					<div class="menu_section">
						<ul class="nav side-menu">
							<li><a href="#"><i class="fa fa-home"></i> Inicio</a></li>
							<li><a href="misRecetas.html"><i class="fa fa-birthday-cake"></i> Mis recetas</a></li>
							<li><a><i class="fa fa-group"></i> Grupos <span class="fa fa-chevron-down"></span></a>
								<ul class="nav child_menu">
									<li><a href="#">Familia</a></li>
									<li><a href="#">Amigos</a></li>
								</ul>
							</li>
							<li><a href="planeacion.html"><i class="fa fa-list-alt"></i> Planeación de recetas</a></li>
							<li><a href="#"><i class="fa fa-money"></i> Lista de compras</a></li>
						</ul>
					</div>
				</div>
				<!-- /sidebar menu -->
			</div>
        </div>

        <!-- top navigation -->
			<div class="top_nav">
				<div class="nav_menu">
					<div class="nav toggle">
						<a id="menu_toggle"><i class="fa fa-bars"></i></a>
					</div>
					<nav class="nav navbar-nav">
						<ul class=" navbar-right">
							<li class="nav-item dropdown open" style="padding-left: 15px;">
								<button type="button" class="btn btn-primary btn-sm">Log out</button>
							</li>
						</ul>
					</nav>
				</div>
			</div>
		<!-- /top navigation -->

        <!-- page content -->
        <div class="right_col" role="main">
			<div class="">
				<div class="page-title">
				</div>
				<div class="clearfix"></div>
				<div class="row">
					<div class="col-md-12 col-sm-12 ">
						<div class="x_panel">
							<div class="x_title">
								<h3> <?php echo $nombre; ?> </h3>
								<div class="clearfix"></div>
							</div>
                  <div class="x_content">

                    <form id="demo-form" data-parsley-validate>                                        
                      	<div class="form-group row">
							<div class="col-md-3 col-sm-3 ">
								<h6 class="col-form-label col-md-12 col-sm-12 ">DURACIÓN: </h6>
								<br>
								<label class="col-form-label col-md-12 col-sm-12 "><?php echo $duracion; ?></label>
							</div>
							<div class="col-md-3 col-sm-3 ">
								<h6 class="col-form-label col-md-12 col-sm-12 ">PORCIONES: </h6>
								<label class="col-form-label col-md-12 col-sm-12 "><?php echo $porciones; ?></label>
							</div>
							<div class="col-md-3 col-sm-3 ">
								<!-- Small modal -->

								<div class="modal fade bs-example-modal-sm" tabindex="-1" role="dialog" aria-hidden="true">
								  <div class="modal-dialog modal-sm">
									<div class="modal-content">
			  
									  <div class="modal-header">
										<h5 class="modal-title" id="myModalLabel2">Agregar receta a planeación</h5>
										<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span>
										</button>
									  </div>
									  <div class="modal-body">
										<div class="form-group row">
											<label class="col-form-label col-md-12 col-sm-12 "></label>
											<div class="col-md-12 col-sm-12 ">
												<label for="fullname">Ingresa el número de porciones que quieres preparar de esta receta:</label>
												<input type="number" class="form-control" name="no_porciones"
													placeholder="Número de porciones" id="no_porciones_planeacion">
											</div>
										</div>
									  </div>
									  <div class="modal-footer">
										<button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
										<button type="button" class="btn btn-success" onclick="actionCreate('<?php echo $idReceta; ?>');">Guardar</button>

									  </div>
			  
									</div>
								  </div>
								</div>
								<!-- /modals -->
							</div>
							<div class="col-md-3 col-sm-3 " align="right">
								<button type="button" class="btn btn-info" onclick="actionDelete('<?php echo $idReceta; ?>');">Eliminar de planeación </button>
							</div>
						</div>

                      	<div class="form-group row">
							<div class="col-md-6 col-sm-6 ">
								<h6 class="col-form-label col-md-12 col-sm-12 ">INGREDIENTES: </h6>	
								<ul>
									<?php 
									echo "<li>".round($cantidad*$equiv,1)." ". $unidad." de ".$ingredientes."</li>";
									while($ingredientes = mysqli_fetch_assoc($resultadoingrediente) and $cantidad= mysqli_fetch_assoc($resultadocantidad) and $unidad= mysqli_fetch_assoc($resultadounidad))
									{
										echo "<li>".round($cantidad['cantidad']*$equiv,1)." ". $unidad["unidad_medida"]." de ".$ingredientes['nombre']. "</li>";
									}

									?>
								</ul>																								
							</div>
							<div class="col-md-6 col-sm-8 ">
										
									<!--IMAGEN-->

										<?php
										

										echo '<img  width=100% height=70% src="data:image/jpeg;base64,' . $imagen_base64 . '">';


										?>
									<div class="caption" align="center">
										<p>Calificación:</p>
										<!--Agregar el onclick en <a>, NO en span-->
										<a href="#"><span class="glyphicon glyphicon-star" aria-hidden="true" type="button"></span></a>
										<a href="#"><span class="glyphicon glyphicon-star" aria-hidden="true" type="button"></span></a>
										<a href="#"><span class="glyphicon glyphicon-star" aria-hidden="true" type="button"></span></a>
										<a href="#"><span class="glyphicon glyphicon-star" aria-hidden="true" type="button"></span></a>
										<a href="#"><span class="glyphicon glyphicon-star-empty" aria-hidden="true" type="button"></span></a>
									</div>
							</div>
						</div>
						<div class="form-group row">
							<div class="col-md-12 col-sm-12 ">
								<h6 class="col-form-label col-md-12 col-sm-12 ">PROCEDIMIENTO: </h6>	                            
							</div>
						</div>
						</form>
						
                    <!-- Tabs -->
					<div id="wizard_verticle" class="form_wizard wizard_verticle">
						<ul id="steps-list" class="list-unstyled wizard_steps">
							<?php 
							$cont=1;
							echo "<li><a href=\"#step-$cont\" data-step=\"$cont\"><span class=\"step_no\">$cont</span></a></li>";
							$cont++;
							while($pasos = mysqli_fetch_assoc($resultadopasos)) {
								echo "<li><a href=\"#step-$cont\" data-step=\"$cont\"><span class=\"step_no\">$cont</span></a></li>";
								$cont++;
							} 
							?>
						</ul>
					
						<?php 
							$cont=1;
							mysqli_data_seek($resultadopasos, 0); // reset the data pointer
							while($pasos = mysqli_fetch_assoc($resultadopasos) and $fila = mysqli_fetch_assoc($resultadoimgpasos)) {
							echo "<div id=\"step-$cont\">";
								echo "<br>";
								echo "<div class=\"col-md-6 col-sm-6\">";
									echo "<h2 class=\"StepTitle\">Paso $cont</h2>";
									echo "<p>{$pasos['paso']}</p>";
								echo "</div>";
								echo "<div class=\"col-md-6 col-sm-6\">";
								echo "<div class=\"image view view-first\">";
									// Obtener la variable BLOB de la fila actual
									$imagen = $fila['imagen'];
  
									// Mostrar la imagen en la página utilizando la función base64_encode
									if (!empty($imagen)) {
										echo '<img width="100%" height="100%" src="data:image/jpeg;base64,' . base64_encode($imagen) . '">';
									}

									echo "</div>";
								echo "</div>";
							echo "</div>";
							
							$cont++;	
							} 
							
						?>
					</div>
					<!-- End SmartWizard Content -->
				     </div>
                   </div>
               </div>
             </div>
          </div>
        </div>
        <!-- /page content -->

        <!-- footer content -->
        <footer>
			<div class="pull-right">
				© 2023 Desarrollado por METAS
			</div>
			<div class="clearfix"></div>
		</footer>
        <!-- /footer content -->
      </div>
    </div>

    <!-- jQuery -->
    <script src="../../gentelella-master/vendors/jquery/dist/jquery.min.js"></script>
    <!-- Bootstrap -->
   <script src="../../gentelella-master/vendors/bootstrap/dist/js/bootstrap.bundle.min.js"></script>
    <!-- FastClick -->
    <script src="../../gentelella-master/vendors/fastclick/lib/fastclick.js"></script>
    <!-- NProgress -->
    <script src="../../gentelella-master/vendors/nprogress/nprogress.js"></script>
    <!-- jQuery Smart Wizard -->
    <script src="../../gentelella-master/vendors/jQuery-Smart-Wizard/js/jquery.smartWizard.js"></script>
    <!-- Custom Theme Scripts -->
    <script src="../../gentelella-master/build/js/custom.min.js"></script>

    <!-- Agregar elemento a planeación -->
    <script src="../js/agregarPlaneacion.js"></script>
	
  </body>
</html>