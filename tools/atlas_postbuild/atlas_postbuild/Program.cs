using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace atlas_postbuild
{
	class Program
	{
		static void Main(string[] args)
		{
			if (args.Length != 1)
			{
				Console.WriteLine("Usage: atlas_postbuild <atlas js file path>");
				return;
			}

			// read atlas data file
			string atlasDataFile = args[0];
			List<string> atlasLines = File.ReadAllLines(atlasDataFile).ToList();

			// get text files in working directory
			foreach (string file in Directory.GetFiles(Directory.GetCurrentDirectory(), "*.txt"))
			{
				string atlasName = Path.GetFileNameWithoutExtension(file);
				string atlasPath = "media/" + atlasName + "_atlas.png";
				string[] dataLines = File.ReadAllLines(file);

				Console.WriteLine(atlasName);

				// transform data
				for (int i = 0; i < dataLines.Length; i++)
				{
					if (!string.IsNullOrEmpty(dataLines[i]))
					{
						dataLines[i] = "\"" + dataLines[i].Replace(" = ", "\":[").Replace(' ', ',') + "]";
					}
				}

				// get atlas image width/height
				int width = 0;
				int height = 0;
				using (FileStream stream = new FileStream("../" + atlasPath, FileMode.Open, FileAccess.Read))
				{
					if (stream.ReadByte() != 0x89
						|| stream.ReadByte() != 0x50
						|| stream.ReadByte() != 0x4E
						|| stream.ReadByte() != 0x47)
					{
						Console.Error.WriteLine("Atlas image '" + atlasPath + "' is not a PNG.");
						return;
					}

					stream.Seek(16, SeekOrigin.Begin);

					byte[] bytes = new byte[8];
					stream.Read(bytes, 0, 8);
					for (int i = 0; i <= 3; i++)
					{
						width = bytes[i] | width << 8;
						height = bytes[i + 4] | height << 8;
					}
				}
				Console.WriteLine("Width is " + width);
				Console.WriteLine("Height is " + height);

				// seek to atlas section
				int dataStart = 0;
				for (; dataStart < atlasLines.Count; dataStart++)
				{
					if (atlasLines[dataStart].Trim() == "\"" + atlasName + "\":")
					{
						break;
					}
				}

				int spritesStart;

				// if data was not found, need to create it
				if (dataStart >= atlasLines.Count)
				{
					Console.WriteLine("Created new entry for '" + atlasName + "'");
					dataStart = atlasLines.Count - 1;
					int insertPoint = dataStart;
					atlasLines.Insert(insertPoint++, "\t\"" + atlasName + "\":");
					atlasLines.Insert(insertPoint++, "\t{");
					atlasLines.Insert(insertPoint++, "\t\t\"url\": \"" + atlasPath + "\",");
					atlasLines.Insert(insertPoint++, "\t\t\"width\": " + width + ",");
					atlasLines.Insert(insertPoint++, "\t\t\"height\": " + height + ",");
					atlasLines.Insert(insertPoint++, "\t\t\"sprites\":");
					atlasLines.Insert(insertPoint++, "\t\t{");
					spritesStart = insertPoint;
					atlasLines.Insert(insertPoint++, "\t\t} //sprites");
					atlasLines.Insert(insertPoint++, "\t},");
				}
				else
				{
					// update width and height
					for (int i = dataStart; i < atlasLines.Count && !atlasLines[i].TrimStart().StartsWith("}"); i++)
					{
						if (atlasLines[i].Trim().StartsWith("\"width\":"))
						{
							Console.WriteLine("Adjusting width: " + width);
							atlasLines[i] = "\t\t\"width\": " + width + ",";
						}
						if (atlasLines[i].Trim().StartsWith("\"height\":"))
						{
							Console.WriteLine("Adjusting height: " + height);
							atlasLines[i] = "\t\t\"height\": " + height + ",";
						}
					}

					// seek to sprites section
					spritesStart = dataStart;
					for (; spritesStart < atlasLines.Count; spritesStart++)
					{
						if (atlasLines[spritesStart].Trim() == "\"sprites\":")
						{
							spritesStart += 2;
							break;
						}
					}
					if (spritesStart == dataStart)
					{
						Console.Error.WriteLine("Atlas '" + atlasName + "': did not find 'sprites' section.");
						return;
					}
				}

				// clear sprites
				while (atlasLines[spritesStart].Trim() != "} //sprites")
				{
					atlasLines.RemoveAt(spritesStart);
				}

				// insert sprites
				for (int i = 0; i < dataLines.Length; i++)
				{
					if (!string.IsNullOrEmpty(dataLines[i]))
					{
						string data = dataLines[i];
						if (i < dataLines.Length - 1)
						{
							data += ",";
						}
                        atlasLines.Insert(spritesStart++, "\t\t\t" + data);
					}
				}
			}

			// rewrite atlas data
			File.WriteAllLines(atlasDataFile, atlasLines.ToArray());
		}
	}
}
