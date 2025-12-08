import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Edit2, Trash2, PlusCircle, X, Save, AlertTriangle } from 'lucide-react';
import { API_ENDPOINTS } from '../../utils/config';

const ACTIVIDADES_API = API_ENDPOINTS.ACTIVIDADES;
const ASIGNATURAS_API = API_ENDPOINTS.ASIGNATURAS;
const PREGUNTAS_API = API_ENDPOINTS.PREGUNTAS;

const Grados = () => {
  // Helper para crear una pregunta vacía tipo Google Forms
  const createEmptyQuestion = (opts = {}) => ({
    id: `new-${Date.now()}-${Math.random()}`, // id temporal
    text: '',
    required: false,
    isNew: true,
    options: [
      { id: 1, text: '', isCorrect: false },
      { id: 2, text: '', isCorrect: false },
    ],
    ...opts,
  });

  // Estado para las actividades (cursos)
  const [cursos, setCursos] = useState([]);

  // Estado para las asignaturas (para el select)
  const [asignaturas, setAsignaturas] = useState([]);

  // Estados para modales
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);

  // Estado para el formulario de actividad
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    estado: 'Activo',
    asignatura_id: '',
    imagen: 'https://via.placeholder.com/50',
  });

  // Estado para preguntas tipo Google Forms
  const [questions, setQuestions] = useState([createEmptyQuestion()]);

  // Cargar actividades y asignaturas al montar
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Actividades
        const resAct = await fetch(ACTIVIDADES_API, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const actividades = await resAct.json();

        const mapeadas = actividades.map(a => ({
          id: a.id,
          nombre: a.nombre,
          descripcion: a.descripcion || '',
          estado: a.estatus === 'activo' ? 'Activo' : 'Inactivo',
          asignatura_id: a.asignatura_id,
          asignatura_nombre: a.asignatura ? a.asignatura.nombre : '',
          imagen: 'https://via.placeholder.com/50',
        }));
        setCursos(mapeadas);

        // Asignaturas
        const resAsig = await fetch(ASIGNATURAS_API, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const dataAsig = await resAsig.json();
        setAsignaturas(dataAsig);
      } catch (error) {
        console.error('Error cargando datos', error);
      }
    };

    fetchData();
  }, []);

  // Manejar cambios en el formulario de actividad
  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  //   LÓGICA GOOGLE FORMS
  // =========================

  const addQuestion = () => {
    setQuestions(prev => [...prev, createEmptyQuestion()]);
  };

  const removeQuestion = id => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  const updateQuestionText = (id, value) => {
    setQuestions(prev =>
      prev.map(q => (q.id === id ? { ...q, text: value } : q))
    );
  };

  const toggleRequired = id => {
    setQuestions(prev =>
      prev.map(q =>
        q.id === id ? { ...q, required: !q.required } : q
      )
    );
  };

  const addOption = questionId => {
    setQuestions(prev =>
      prev.map(q => {
        if (q.id !== questionId) return q;
        const nextId =
          q.options.length === 0
            ? 1
            : Math.max(...q.options.map(o => o.id)) + 1;
        return {
          ...q,
          options: [
            ...q.options,
            { id: nextId, text: '', isCorrect: false },
          ],
        };
      })
    );
  };

  const changeOptionCorrect = (questionId, optionId, value) => {
    const isCorrect = value === 'correcta';

    setQuestions(prev =>
      prev.map(q => {
        if (q.id !== questionId) return q;

        return {
          ...q,
          options: q.options.map(o =>
            o.id === optionId
              ? { ...o, isCorrect }
              : isCorrect
              ? { ...o, isCorrect: false }
              : o
          ),
        };
      })
    );
  };

  const removeOption = (questionId, optionId) => {
    setQuestions(prev =>
      prev.map(q => {
        if (q.id !== questionId) return q;
        return {
          ...q,
          options: q.options.filter(o => o.id !== optionId),
        };
      })
    );
  };

  const updateOptionText = (questionId, optionId, value) => {
    setQuestions(prev =>
      prev.map(q => {
        if (q.id !== questionId) return q;
        return {
          ...q,
          options: q.options.map(o =>
            o.id === optionId ? { ...o, text: value } : o
          ),
        };
      })
    );
  };

  const resetQuestions = () => {
    setQuestions([createEmptyQuestion()]);
  };

  // Agregar nueva actividad (curso) + preguntas
  const handleAddCourse = async () => {
    if (!formData.nombre.trim() || !formData.descripcion.trim()) return;
    if (!formData.asignatura_id) {
      alert('Selecciona una asignatura.');
      return;
    }

    try {
      // 1) Crear solo la actividad
      const actividadPayload = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        asignatura_id: formData.asignatura_id,
        estatus: formData.estado === 'Activo' ? 'activo' : 'inactivo',
      };

      const resActividad = await fetch(ACTIVIDADES_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(actividadPayload),
      });

      if (!resActividad.ok) throw new Error('Error al crear actividad');

      const actividad = await resActividad.json();

      // 2) Crear las preguntas en /api/preguntas
      const preguntasLimpias = questions.filter(
        q =>
          q.text.trim() !== '' &&
          q.options.some(opt => opt.text.trim() !== '')
      );

      if (preguntasLimpias.length > 0) {
        const preguntasPayloads = preguntasLimpias.map(q => ({
          actividad_id: actividad.id,
          titulo: q.text,
          descripcion: null,
          puntos: 1,
          opciones: q.options
            .filter(opt => opt.text.trim() !== '')
            .map(opt => ({
              texto: opt.text,
              es_correcta: !!opt.isCorrect,
            })),
        }));

        await Promise.all(
          preguntasPayloads.map(p =>
            fetch(PREGUNTAS_API, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(p),
            })
          )
        );
      }

      // 3) Actualizar tabla de cursos en el front
      const asignaturaEncontrada = asignaturas.find(
        a => Number(a.id) === Number(actividad.asignatura_id)
      );

      const newCourse = {
        id: actividad.id,
        nombre: actividad.nombre,
        descripcion: actividad.descripcion || '',
        estado: actividad.estatus === 'activo' ? 'Activo' : 'Inactivo',
        asignatura_id: actividad.asignatura_id,
        asignatura_nombre: asignaturaEncontrada
          ? asignaturaEncontrada.nombre
          : '',
        imagen: formData.imagen || 'https://via.placeholder.com/50',
      };

      setCursos(prev => [...prev, newCourse]);

      // 4) Limpiar formulario
      setFormData({
        nombre: '',
        descripcion: '',
        estado: 'Activo',
        asignatura_id: '',
        imagen: 'https://via.placeholder.com/50',
      });
      resetQuestions();
      setShowAddModal(false);
    } catch (error) {
      console.error(error);
      alert('Ocurrió un error al guardar la actividad o sus preguntas.');
    }
  };

  // Editar curso (abrir modal con datos)
  const handleEditCourse = course => {
    setCurrentCourse(course);
    setFormData({
      nombre: course.nombre,
      descripcion: course.descripcion,
      estado: course.estado,
      asignatura_id: course.asignatura_id || '',
      imagen: course.imagen,
    });

    (async () => {
      try {
        const res = await fetch(
          `${PREGUNTAS_API}?actividad_id=${course.id}`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }
        );
        if (!res.ok) {
          setQuestions([createEmptyQuestion()]);
        } else {
          const data = await res.json();
          const mapped = data.map(p => ({
            id: p.id,
            text: p.titulo || '',
            required: false,
            isNew: false,
            options: (p.opciones || []).map((o, idx) => ({
              id: idx + 1,
              text: o.texto || '',
              isCorrect: !!o.es_correcta,
            })),
          }));
          setQuestions(mapped.length ? mapped : [createEmptyQuestion()]);
        }
      } catch (err) {
        console.error('Error cargando preguntas para edición', err);
        setQuestions([createEmptyQuestion()]);
      } finally {
        setShowEditModal(true);
      }
    })();
  };

  // Guardar cambios de edición
  const handleSaveEdit = async () => {
    if (!formData.nombre.trim() || !formData.descripcion.trim()) return;
    if (!formData.asignatura_id) {
      alert('Selecciona una asignatura.');
      return;
    }

    try {
      const payload = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        asignatura_id: formData.asignatura_id,
        estatus: formData.estado === 'Activo' ? 'activo' : 'inactivo',
      };

      const res = await fetch(`${ACTIVIDADES_API}/${currentCourse.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Error al actualizar actividad');

      const actividadActualizada = await res.json();

      // Preguntas: crear, actualizar y eliminar
      const toCreate = questions.filter(q => q.isNew);
      const toUpdate = questions.filter(q => !q.isNew);

      // Crear nuevas
      await Promise.all(
        toCreate.map(async q => {
          const payloadQ = {
            actividad_id: actividadActualizada.id,
            titulo: q.text,
            descripcion: null,
            puntos: 1,
            opciones: q.options.map(o => ({
              texto: o.text,
              es_correcta: !!o.isCorrect,
            })),
          };
          const r = await fetch(PREGUNTAS_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payloadQ),
          });
          if (!r.ok) {
            const txt = await r.text();
            throw new Error('Error creando pregunta: ' + txt);
          }
        })
      );

      // Actualizar existentes
      await Promise.all(
        toUpdate.map(async q => {
          const r = await fetch(`${PREGUNTAS_API}/${q.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              actividad_id: actividadActualizada.id,
              titulo: q.text,
              descripcion: null,
              puntos: 1,
              opciones: q.options.map(o => ({
                texto: o.text,
                es_correcta: !!o.isCorrect,
              })),
            }),
          });
          if (!r.ok) {
            const txt = await r.text();
            throw new Error('Error actualizando pregunta: ' + txt);
          }
        })
      );

      // Eliminar preguntas que se hayan borrado
      try {
        const resPrev = await fetch(
          `${PREGUNTAS_API}?actividad_id=${currentCourse.id}`
        );
        if (resPrev.ok) {
          const prev = await resPrev.json();
          const prevIds = prev.map(p => Number(p.id));
          const currentIds = questions
            .filter(q => !q.isNew)
            .map(q => Number(q.id));
          const idsToDelete = prevIds.filter(
            id => !currentIds.includes(id)
          );
          await Promise.all(
            idsToDelete.map(id =>
              fetch(`${PREGUNTAS_API}/${id}`, { method: 'DELETE' })
            )
          );
        }
      } catch (e) {
        console.warn(
          'No se pudo procesar borrado de preguntas (endpoint faltante)',
          e
        );
      }

      // actualizar lista de cursos
      const asignaturaEncontrada = asignaturas.find(
        a =>
          Number(a.id) === Number(actividadActualizada.asignatura_id)
      );

      setCursos(prev =>
        prev.map(curso =>
          curso.id === currentCourse.id
            ? {
                ...curso,
                nombre: actividadActualizada.nombre,
                descripcion: actividadActualizada.descripcion || '',
                estado:
                  actividadActualizada.estatus === 'activo'
                    ? 'Activo'
                    : 'Inactivo',
                asignatura_id: actividadActualizada.asignatura_id,
                asignatura_nombre: asignaturaEncontrada
                  ? asignaturaEncontrada.nombre
                  : '',
                imagen: formData.imagen,
              }
            : curso
        )
      );

      setShowEditModal(false);
      setCurrentCourse(null);
      setFormData({
        nombre: '',
        descripcion: '',
        estado: 'Activo',
        asignatura_id: '',
        imagen: 'https://via.placeholder.com/50',
      });
      resetQuestions();
    } catch (error) {
      console.error(error);
      alert('Ocurrió un error al actualizar la actividad o sus preguntas.');
    }
  };

  // Confirmar eliminación
  const handleDeleteCourse = course => {
    setCurrentCourse(course);
    setShowDeleteModal(true);
  };

  // Eliminar curso
  const confirmDelete = async () => {
    try {
      const res = await fetch(`${ACTIVIDADES_API}/${currentCourse.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) throw new Error('Error al eliminar actividad');

      setCursos(prev =>
        prev.filter(curso => curso.id !== currentCourse.id)
      );
      setShowDeleteModal(false);
      setCurrentCourse(null);
    } catch (error) {
      console.error(error);
      alert('Ocurrió un error al eliminar la actividad.');
    }
  };

  // Cerrar modales
  const closeModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setCurrentCourse(null);
    setFormData({
      nombre: '',
      descripcion: '',
      estado: 'Activo',
      asignatura_id: '',
      imagen: 'https://via.placeholder.com/50',
    });
    resetQuestions();
  };

  return (
    <MainContent>
      <TableContainer>
        <TableHeader>
          <HeaderTitle>ACTIVIDADES</HeaderTitle>
          <AddButton onClick={() => setShowAddModal(true)}>
            <PlusCircle size={20} />
            <span>Agregar</span>
          </AddButton>
        </TableHeader>

        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <TableCell as="th">#</TableCell>
                <TableCell as="th">Estado</TableCell>
                <TableCell as="th">Nombre</TableCell>
                <TableCell as="th">Descripción</TableCell>
                <TableCell as="th">Asignatura</TableCell>
                <TableCell as="th">Imagen</TableCell>
                <TableCell as="th" align="right">
                  Acciones
                </TableCell>
              </tr>
            </thead>
            <tbody>
              {cursos.map(curso => (
                <TableRow key={curso.id}>
                  <TableCell>{curso.id}</TableCell>
                  <TableCell>
                    <StatusBadge $status={curso.estado}>
                      {curso.estado}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>
                    <SubjectName>{curso.nombre}</SubjectName>
                  </TableCell>
                  <TableCell>
                    <Description>{curso.descripcion}</Description>
                  </TableCell>
                  <TableCell>{curso.asignatura_nombre}</TableCell>
                  <TableCell>
                    <SubjectImageWrapper>
                      <SubjectImage src={curso.imagen} alt="Curso" />
                    </SubjectImageWrapper>
                  </TableCell>
                  <TableCell align="right">
                    <ActionButtons>
                      <ActionButton
                        color="#10b981"
                        onClick={() => handleEditCourse(curso)}
                        title="Editar curso"
                      >
                        <Edit2 size={18} />
                      </ActionButton>
                      <ActionButton
                        color="#ef4444"
                        onClick={() => handleDeleteCourse(curso)}
                        title="Eliminar curso"
                      >
                        <Trash2 size={18} />
                      </ActionButton>
                    </ActionButtons>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </TableWrapper>
      </TableContainer>

      {/* Modal Agregar */}
      <Overlay $isOpen={showAddModal} onClick={closeModals}>
        <Modal $isOpen={showAddModal} onClick={e => e.stopPropagation()}>
          <ModalHeader>
            <ModalTitle>Agregar Nueva Actividad</ModalTitle>
            <CloseButton onClick={closeModals}>
              <X size={24} />
            </CloseButton>
          </ModalHeader>
          <FormContainer>
            <FormGroup>
              <Label>Nombre</Label>
              <Input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                placeholder="Ingrese el nombre"
              />
            </FormGroup>
            <FormGroup>
              <Label>Descripción</Label>
              <TextArea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                placeholder="Ingrese la descripción"
                rows="3"
              />
            </FormGroup>
            <FormGroup>
              <Label>Estado</Label>
              <Select
                name="estado"
                value={formData.estado}
                onChange={handleInputChange}
              >
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </Select>
            </FormGroup>
            <FormGroup>
              <Label>Asignatura</Label>
              <Select
                name="asignatura_id"
                value={formData.asignatura_id}
                onChange={handleInputChange}
              >
                <option value="">Seleccione una asignatura</option>
                {asignaturas.map(asig => (
                  <option key={asig.id} value={asig.id}>
                    {asig.nombre}
                  </option>
                ))}
              </Select>
            </FormGroup>
            <FormGroup>
              <Label>URL de la imagen</Label>
              <Input
                type="text"
                name="imagen"
                value={formData.imagen}
                onChange={handleInputChange}
                placeholder="URL de la imagen"
              />
            </FormGroup>

            {/* 🔹 Constructor de preguntas */}
            <SmallText>Preguntas de la actividad</SmallText>

            {questions.map((q, index) => (
              <QuestionCard key={q.id}>
                <QuestionHeader>
                  <strong>Pregunta {index + 1}</strong>
                  <div>
                    <label
                      style={{ fontSize: '0.8rem', marginRight: 8 }}
                    >
                      <input
                        type="checkbox"
                        checked={q.required}
                        onChange={() => toggleRequired(q.id)}
                        style={{ marginRight: 4 }}
                      />
                      Obligatoria
                    </label>
                    {questions.length > 1 && (
                      <RemoveButton
                        type="button"
                        onClick={() => removeQuestion(q.id)}
                      >
                        Eliminar
                      </RemoveButton>
                    )}
                  </div>
                </QuestionHeader>

                <Input
                  placeholder="Texto de la pregunta"
                  value={q.text}
                  onChange={e =>
                    updateQuestionText(q.id, e.target.value)
                  }
                />

                <SmallText>
                  Opciones de respuesta (opción múltiple)
                </SmallText>

                {q.options.map(opt => (
                  <div key={opt.id} style={{ marginBottom: '8px' }}>
                    <OptionRow>
                      <SmallInput
                        placeholder={`Opción ${opt.id}`}
                        value={opt.text}
                        onChange={e =>
                          updateOptionText(
                            q.id,
                            opt.id,
                            e.target.value
                          )
                        }
                      />
                      {q.options.length > 1 && (
                        <RemoveButton
                          type="button"
                          onClick={() =>
                            removeOption(q.id, opt.id)
                          }
                        >
                          X
                        </RemoveButton>
                      )}
                    </OptionRow>

                    <div
                      style={{
                        marginLeft: '4px',
                        marginTop: '4px',
                      }}
                    >
                      <label
                        style={{
                          fontSize: '0.8rem',
                          color: '#4b5563',
                        }}
                      >
                        Respuesta:
                        <select
                          style={{
                            marginLeft: '6px',
                            padding: '4px 6px',
                            borderRadius: '6px',
                            border: '1px solid #e5e7eb',
                            fontSize: '0.8rem',
                          }}
                          value={
                            opt.isCorrect
                              ? 'correcta'
                              : 'incorrecta'
                          }
                          onChange={e =>
                            changeOptionCorrect(
                              q.id,
                              opt.id,
                              e.target.value
                            )
                          }
                        >
                          <option value="incorrecta">
                            Incorrecta
                          </option>
                          <option value="correcta">
                            Correcta
                          </option>
                        </select>
                      </label>
                    </div>
                  </div>
                ))}

                <SecondarySmallButton
                  type="button"
                  onClick={() => addOption(q.id)}
                >
                  + Agregar opción
                </SecondarySmallButton>
              </QuestionCard>
            ))}

            <div style={{ marginTop: '12px' }}>
              <SecondarySmallButton type="button" onClick={addQuestion}>
                + Agregar pregunta
              </SecondarySmallButton>
            </div>
          </FormContainer>
          <ButtonGroup>
            <SecondaryButton type="button" onClick={closeModals}>
              <X size={16} />
              Cancelar
            </SecondaryButton>
            <PrimaryButton onClick={handleAddCourse}>
              <Save size={16} />
              Guardar
            </PrimaryButton>
          </ButtonGroup>
        </Modal>
      </Overlay>

      {/* Modal Editar */}
      <Overlay $isOpen={showEditModal} onClick={closeModals}>
        <Modal $isOpen={showEditModal} onClick={e => e.stopPropagation()}>
          <ModalHeader>
            <ModalTitle>Editar Actividad</ModalTitle>
            <CloseButton onClick={closeModals}>
              <X size={24} />
            </CloseButton>
          </ModalHeader>
          <FormContainer>
            <FormGroup>
              <Label>Nombre</Label>
              <Input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                placeholder="Ingrese el nombre"
              />
            </FormGroup>
            <FormGroup>
              <Label>Descripción</Label>
              <TextArea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                placeholder="Ingrese la descripción"
                rows="3"
              />
            </FormGroup>
            <FormGroup>
              <Label>Estado</Label>
              <Select
                name="estado"
                value={formData.estado}
                onChange={handleInputChange}
              >
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </Select>
            </FormGroup>
            <FormGroup>
              <Label>Asignatura</Label>
              <Select
                name="asignatura_id"
                value={formData.asignatura_id}
                onChange={handleInputChange}
              >
                <option value="">Seleccione una asignatura</option>
                {asignaturas.map(asig => (
                  <option key={asig.id} value={asig.id}>
                    {asig.nombre}
                  </option>
                ))}
              </Select>
            </FormGroup>
            <FormGroup>
              <Label>URL de la imagen</Label>
              <Input
                type="text"
                name="imagen"
                value={formData.imagen}
                onChange={handleInputChange}
                placeholder="URL de la imagen"
              />
            </FormGroup>

            <SmallText>Preguntas de la actividad</SmallText>
            {questions.map((q, index) => (
              <QuestionCard key={q.id}>
                <QuestionHeader>
                  <strong>Pregunta {index + 1}</strong>
                  <div>
                    <label
                      style={{ fontSize: '0.8rem', marginRight: 8 }}
                    >
                      <input
                        type="checkbox"
                        checked={q.required}
                        onChange={() => toggleRequired(q.id)}
                        style={{ marginRight: 4 }}
                      />
                      Obligatoria
                    </label>
                    {questions.length > 1 && (
                      <RemoveButton
                        type="button"
                        onClick={() => removeQuestion(q.id)}
                      >
                        Eliminar
                      </RemoveButton>
                    )}
                  </div>
                </QuestionHeader>

                <Input
                  placeholder="Texto de la pregunta"
                  value={q.text}
                  onChange={e =>
                    updateQuestionText(q.id, e.target.value)
                  }
                />

                <SmallText>
                  Opciones de respuesta (opción múltiple)
                </SmallText>

                {q.options.map(opt => (
                  <div key={opt.id} style={{ marginBottom: '8px' }}>
                    <OptionRow>
                      <SmallInput
                        placeholder={`Opción ${opt.id}`}
                        value={opt.text}
                        onChange={e =>
                          updateOptionText(
                            q.id,
                            opt.id,
                            e.target.value
                          )
                        }
                      />
                      {q.options.length > 1 && (
                        <RemoveButton
                          type="button"
                          onClick={() =>
                            removeOption(q.id, opt.id)
                          }
                        >
                          X
                        </RemoveButton>
                      )}
                    </OptionRow>

                    <div
                      style={{
                        marginLeft: '4px',
                        marginTop: '4px',
                      }}
                    >
                      <label
                        style={{
                          fontSize: '0.8rem',
                          color: '#4b5563',
                        }}
                      >
                        Respuesta:
                        <select
                          style={{
                            marginLeft: '6px',
                            padding: '4px 6px',
                            borderRadius: '6px',
                            border: '1px solid #e5e7eb',
                            fontSize: '0.8rem',
                          }}
                          value={
                            opt.isCorrect
                              ? 'correcta'
                              : 'incorrecta'
                          }
                          onChange={e =>
                            changeOptionCorrect(
                              q.id,
                              opt.id,
                              e.target.value
                            )
                          }
                        >
                          <option value="incorrecta">
                            Incorrecta
                          </option>
                          <option value="correcta">
                            Correcta
                          </option>
                        </select>
                      </label>
                    </div>
                  </div>
                ))}

                <SecondarySmallButton
                  type="button"
                  onClick={() => addOption(q.id)}
                >
                  + Agregar opción
                </SecondarySmallButton>
              </QuestionCard>
            ))}
          </FormContainer>
          <ButtonGroup>
            <SecondaryButton type="button" onClick={closeModals}>
              <X size={16} />
              Cancelar
            </SecondaryButton>
            <PrimaryButton onClick={handleSaveEdit}>
              <Save size={16} />
              Guardar Cambios
            </PrimaryButton>
          </ButtonGroup>
        </Modal>
      </Overlay>

      {/* Modal Eliminar */}
      <Overlay $isOpen={showDeleteModal} onClick={closeModals}>
        <Modal
          $isOpen={showDeleteModal}
          onClick={e => e.stopPropagation()}
        >
          <ModalHeader>
            <ModalTitle style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertTriangle size={22} />
              Confirmar Eliminación
            </ModalTitle>
            <CloseButton onClick={closeModals}>
              <X size={24} />
            </CloseButton>
          </ModalHeader>
          <FormContainer>
            <DeleteMessage>
              <p>
                ¿Estás seguro de que deseas eliminar la actividad{' '}
                <strong>"{currentCourse?.nombre}"</strong>?
              </p>
              <p
                style={{
                  color: '#666',
                  fontSize: '14px',
                  marginTop: '10px',
                }}
              >
                Esta acción no se puede deshacer.
              </p>
            </DeleteMessage>
          </FormContainer>
          <ButtonGroup>
            <SecondaryButton type="button" onClick={closeModals}>
              Cancelar
            </SecondaryButton>
            <DangerButton onClick={confirmDelete}>
              <Trash2 size={16} />
              Eliminar
            </DangerButton>
          </ButtonGroup>
        </Modal>
      </Overlay>
    </MainContent>
  );
};

export default Grados;

/* ================= ESTILOS (mismo diseño que Asignaturas/Usuarios) ================= */

const MainContent = styled.div`
  width: 100%;
  padding: 0;
  overflow-y: auto;
  background: transparent;
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border: 2px solid transparent;
  transition: all 0.4s ease;

  &:hover {
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    border-color: #7c3aed;
  }
`;

const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
  border-bottom: 3px solid #6d28d9;

  @media (max-width: 768px) {
    padding: 1rem 1.5rem;
    flex-wrap: wrap;
    gap: 1rem;
  }
`;

const HeaderTitle = styled.h2`
  color: white;
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0;
  letter-spacing: 1px;
  text-transform: uppercase;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  color: #7c3aed;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 700;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 255, 255, 0.3);
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &:hover {
    background: #f8fafc;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 255, 255, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  max-height: 600px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f5f9;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;

  thead {
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    position: sticky;
    top: 0;
    z-index: 10;

    th {
      font-weight: 700;
      color: #1e293b;
      text-transform: uppercase;
      font-size: 0.85rem;
      letter-spacing: 0.5px;
      padding: 1rem;
      border-bottom: 2px solid #cbd5e1;
    }
  }
`;

const TableRow = styled.tr`
  background: white;
  transition: all 0.3s ease;
  border-bottom: 1px solid #f1f5f9;

  &:hover {
    background: linear-gradient(135deg, #fefefe 0%, #f8fafc 100%);
    transform: translateX(5px);
    box-shadow: 0 4px 15px rgba(124, 58, 237, 0.1);
  }

  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  text-align: ${props => props.align || 'left'};
  color: #64748b;
  font-size: 0.9rem;
  vertical-align: middle;

  @media (max-width: 768px) {
    padding: 0.8rem 0.5rem;
    font-size: 0.85rem;
  }
`;

const SubjectName = styled.span`
  font-weight: 600;
  color: #1e293b;
  font-size: 1rem;
`;

const Description = styled.span`
  color: #64748b;
  font-size: 0.9rem;
  line-height: 1.4;
`;

const SubjectImageWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const SubjectImage = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 50%;
  border: 3px solid #e2e8f0;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: scale(1.15);
    border-color: #7c3aed;
    box-shadow: 0 4px 15px rgba(124, 58, 237, 0.3);
  }
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.4rem 0.9rem;
  border-radius: 20px;
  background: ${props =>
    props.$status === 'Activo' ? '#10b98115' : '#ef444415'};
  color: ${props => (props.$status === 'Activo' ? '#10b981' : '#ef4444')};
  font-weight: 600;
  font-size: 0.8rem;
  border: 2px solid
    ${props => (props.$status === 'Activo' ? '#10b981' : '#ef4444')};
  text-transform: uppercase;
  letter-spacing: 0.3px;
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

const ActionButton = styled.button`
  background: ${props => props.color}15;
  border: 2px solid ${props => props.color};
  color: ${props => props.color};
  padding: 8px;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.color};
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${props => props.color}40;
  }

  &:active {
    transform: translateY(0);
  }
`;

/* Modal */

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  opacity: ${props => (props.$isOpen ? 1 : 0)};
  visibility: ${props => (props.$isOpen ? 'visible' : 'hidden')};
  transition: all 0.3s ease;
  backdrop-filter: blur(4px);
`;

const Modal = styled.div`
  background: white;
  border-radius: 20px;
  padding: 0;
  max-width: 720px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  transform: ${props => (props.$isOpen ? 'scale(1)' : 'scale(0.95)')};
  transition: transform 0.3s ease;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 10px;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
  border-bottom: 3px solid #6d28d9;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.4rem;
  font-weight: 800;
  color: white;
  letter-spacing: 0.5px;
  text-transform: uppercase;
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  padding: 8px;
  border-radius: 50%;
  cursor: pointer;
  color: white;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: rotate(90deg);
  }
`;

const FormContainer = styled.div`
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #1e293b;
  font-weight: 600;
  font-size: 0.95rem;
  letter-spacing: 0.3px;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.9rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #7c3aed;
    box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.1);
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.9rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.95rem;
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
  transition: all 0.3s ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #7c3aed;
    box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.1);
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.9rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.95rem;
  background: white;
  transition: all 0.3s ease;
  box-sizing: border-box;
  font-family: inherit;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #7c3aed;
    box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.1);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 1.5rem 2rem;
  border-top: 2px solid #f1f5f9;
  background: linear-gradient(135deg, #fefefe 0%, #f8fafc 100%);

  @media (max-width: 768px) {
    padding: 1rem 1.5rem;
  }
`;

const ButtonBase = styled.button`
  padding: 0.9rem 1.8rem;
  border-radius: 25px;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s.ease;
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media (max-width: 768px) {
    padding: 0.7rem 1.3rem;
    font-size: 0.85rem;
  }
`;

const PrimaryButton = styled(ButtonBase)`
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);

  &:hover {
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

const SecondaryButton = styled(ButtonBase)`
  background: #f1f5f9;
  color: #64748b;
  border: 2px solid #e2e8f0;

  &:hover {
    background: #e2e8f0;
    color: #475569;
    border-color: #cbd5e1;
  }
`;

const DangerButton = styled(ButtonBase)`
  background: linear-gradient(135deg, #ef4444 0%, #b91c1c 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);

  &:hover {
    background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
  }
`;

/* Preguntas tipo Google Forms */

const SmallText = styled.p`
  font-size: 0.8rem;
  color: #6b7280;
  margin: 12px 0 8px 0;
`;

const QuestionCard = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 12px;
  margin-bottom: 12px;
  background: #f9fafb;
`;

const QuestionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const OptionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
`;

const SmallInput = styled.input`
  flex: 1;
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
`;

const RemoveButton = styled.button`
  background: transparent;
  border: none;
  color: #ef4444;
  cursor: pointer;
  font-size: 0.85rem;
`;

const SecondarySmallButton = styled.button`
  background-color: #f1f5f9;
  color: #64748b;
  border: 1px solid #e2e8f0;
  padding: 6px 12px;
  border-radius: 999px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    background-color: #e2e8f0;
    border-color: #cbd5e1;
  }
`;

const DeleteMessage = styled.div`
  text-align: center;
  padding: 20px 0;

  p {
    margin: 0;
    font-size: 16px;
    color: #333;
  }

  strong {
    color: #fde68a;
  }
`;
