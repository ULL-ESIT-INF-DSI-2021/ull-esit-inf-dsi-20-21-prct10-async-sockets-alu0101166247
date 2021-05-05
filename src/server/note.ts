/**
 * Clase Note para representar Notas
 */
export class Note {
  /**
   * Constructor de la clase
   * @param title Titulo
   * @param body Contenido
   * @param color Color
   */
  constructor(
    public title: string,
    public body: string,
    public color: string) { }

  /**
   * Get del titulo
   * @returns Titulo
   */
  public getTitle(): string {
    return this.title;
  }

  /**
   * Set para cambiar el titulo
   * @param title Titulo nuevo
   */
  public setTitle(title: string): void {
    this.title = title;
  }

  /**
   * Get del contenido
   * @returns Contenido
   */
  public getBody(): string {
    return this.body;
  }

  /**
   * Set para cambiar el contenido
   * @param body Body
   */
  public setBody(body: string): void {
    this.body = body;
  }

  /**
  * Get del color
  * @returns Color
  */
  public getColor(): string {
    return this.color;
  }

  /**
  * Set para cambiar el color
  * @param color Nuevo color
  */
  public setColor(color: string): void {
    this.color = color;
  }
}
