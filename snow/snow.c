#include <SDL2/SDL.h>
#include <SDL2/SDL_mixer.h>

int width = 320;
int height = 200;
int scale = 2;
int flakes = 1000;

typedef struct {
  int x;
  int y;
  int z;
} Point;
Point *snow;

SDL_Window *window;
SDL_Renderer *renderer;
SDL_Texture *texture;
SDL_Texture *photo;
Uint32 *pixels;
Mix_Music *music;

void init()
{
  int w = width * scale;
  int h = height * scale;
  SDL_Init(SDL_INIT_EVERYTHING);
  SDL_CreateWindowAndRenderer(w, h, SDL_WINDOW_OPENGL, &window, &renderer);

  texture = SDL_CreateTexture(renderer,
                              SDL_PIXELFORMAT_RGBA32,
                              SDL_TEXTUREACCESS_STREAMING,
                              width, height);
  pixels = malloc(width * height * sizeof(Uint32));

  Mix_OpenAudio(44100, MIX_DEFAULT_FORMAT, 1, 1024);
}

void quit()
{
  free(snow);
  free(pixels);
  Mix_FreeMusic(music);
  Mix_CloseAudio();
  SDL_DestroyTexture(photo);
  SDL_DestroyTexture(texture);
  SDL_DestroyRenderer(renderer);
  SDL_DestroyWindow(window);
  SDL_Quit();
}

void putpixel(int x, int y, int c)
{
  if (x < 0 || x >= width || y < 0 || y >= height) return; 
  pixels[x + y * width] = c;
}

int main(int argc, char *argv[]) {
  init();

  SDL_Surface *image = SDL_LoadBMP("house.bmp");
  photo = SDL_CreateTextureFromSurface(renderer, image);
  SDL_SetTextureBlendMode(photo, SDL_BLENDMODE_BLEND);
  SDL_SetTextureAlphaMod(photo, 100);
  SDL_FreeSurface(image);
  
  music = Mix_LoadMUS("christma.mod");
  Mix_PlayMusic(music, -1);

  snow = malloc(flakes * sizeof(Point));
  for (int i = 0; i < flakes; i++) {
    snow[i].x = rand() % width;
    snow[i].y = rand() % height;
    snow[i].z = rand() % 2 + 1;
  }

  int run = 1;
  int pause = 0;
  while (run) {
    SDL_Event event;
    while (SDL_PollEvent(&event)) {
      if (event.key.keysym.sym == SDLK_q) run = 0;
      if (event.key.keysym.sym == SDLK_SPACE)
        pause = event.type == SDL_KEYDOWN;
    }
    if (pause) continue;

    memset(pixels, 0, width * height * sizeof(Uint32));
    for (int i = 0; i < flakes; i++) {
      Point *p = &snow[i];
      putpixel(p->x, p->y, rand() % 2 ? 0xffffff : 0x808080);
      p->x += rand() % 3 ? 0 : rand() % 2 ? 1 : -1;
      p->y += p->z + rand() % 2;
      if (p->y >= height) {
        p->x = rand() % width;
        p->y = 0;
        p->z = rand() % 2 + 1;
      }
    }
  
    SDL_UpdateTexture(texture, NULL, pixels, width * sizeof(Uint32));
    SDL_RenderCopy(renderer, texture, NULL, NULL);
    SDL_RenderCopy(renderer, photo, NULL, NULL);
    SDL_RenderPresent(renderer);

    SDL_Delay(50);
  }

  quit();
  return 0;
}
